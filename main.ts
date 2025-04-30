import { createClient } from 'npm:@base44/sdk@0.1.0';

const base44 = createClient({
  appId: Deno.env.get('BASE44_APP_ID'),
});

// Voice IDs from Eleven Labs - selected child-friendly voices
const VOICE_IDS = {
  "female": "EXAVITQu4vr4xnSDxMaL", // Rachel voice (cheerful female voice)
  "male": "pNInz6obpgDQGcFmaJgB"    // Adam voice (friendly male voice)
};

Deno.serve(async (req) => {
  try {
    // Authenticate the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    base44.auth.setToken(token);
    
    // Get request body
    const { text, voice = "female" } = await req.json();
    
    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate voice parameter
    if (voice !== "female" && voice !== "male") {
      return new Response(JSON.stringify({ error: "Invalid voice type. Must be 'female' or 'male'" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // API Key
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Get the voice ID
    const voiceId = VOICE_IDS[voice];

    // Get alignment data
    const alignmentResponse = await fetch(
      "https://api.elevenlabs.io/v2/text-to-speech/alignment",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text: text,
          voice_id: voiceId,
          model_id: "eleven_monolingual_v1"
        })
      }
    );

    if (!alignmentResponse.ok) {
      const errorData = await alignmentResponse.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ 
          error: "Error getting alignment data", 
          details: errorData
        }),
        {
          status: alignmentResponse.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const alignmentData = await alignmentResponse.json();

    // Get the audio
    const audioResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    );
    
    if (!audioResponse.ok) {
      const errorData = await audioResponse.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ 
          error: "Error generating audio",
          details: errorData
        }),
        {
          status: audioResponse.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Get the audio data as blob
    const audioBlob = await audioResponse.blob();
    
    try {
      // Upload the audio file using Base44 SDK
      const uploadData = await base44.storage.upload({
        file: audioBlob,
        filename: "narration.mp3"
      });
      
      // Process alignment data into timestamps
      const timestamps = alignmentData.words.map(word => ({
        text: word.text,
        start: word.start,
        end: word.end
      }));
      
      return new Response(
        JSON.stringify({
          audioUrl: uploadData.url,
          timestamps: timestamps,
          duration: timestamps[timestamps.length - 1]?.end || 0
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to upload audio file",
          details: uploadError.message
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process text-to-speech request",
        details: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}); 