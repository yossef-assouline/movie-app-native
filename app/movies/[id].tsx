import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { fetchMovieDetails } from "@/services/api";
import { saveMovie, getSavedMovies, removeSavedMovie, checkAuth } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import icon from "@/assets/icons/star.png";
import arrow from "@/assets/icons/arrow.png";
import { useRouter } from "expo-router";
import save from "@/assets/icons/save.png";

interface MovieInfoProps {
  label: string;
  value: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm">{value || 'N/A'}</Text>
  </View>
);

const formatCurrency = (amount: number | undefined): string => {
  if (!amount) return 'N/A';
  
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)} billion`;
  }
  return `$${(amount / 1_000_000).toFixed(0)} million`;
};

const MovieDetails = () => {
  
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const session = await checkAuth();
        setLoggedInUser(session);
      } catch (error) {
        setLoggedInUser(false);
      }
    };
    checkUserAuth();
  }, []);

  useEffect(() => {
    checkIfMovieIsSaved();
  }, [id]);

  const checkIfMovieIsSaved = async () => {
    try {
      const savedMovies = await getSavedMovies();
      const isMovieSaved = savedMovies.some((savedMovie: any) => savedMovie.movieId === id);
      setIsSaved(isMovieSaved);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveMovie = async (movie: Movie) => {
    if (!movie || isSaving) return;
    
    try {
      setIsSaving(true);
      await saveMovie(movie);
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving movie:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSavedMovie = async (movieId: string) => {
    if (!movieId || isSaving) return;
    
    try {
      setIsSaving(true);
      await removeSavedMovie(movieId);
      setIsSaved(false);
    } catch (error) {
      console.error('Error removing saved movie:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
        </View>
        <View className="flex-col items-start justify-center mt-5 px-5 border">
          <TouchableOpacity 
            className="flex items-center justify-center absolute top-5 right-5" 
            onPress={() => {
              if(loggedInUser){
                isSaved ? handleRemoveSavedMovie(movie?.id?.toString() ?? "") : handleSaveMovie(movie);
              }else{
                router.push("/profile");
              }
            }}
            disabled={isSaving}
          >
            <Image 
              source={save} 
              className="size-8" 
              tintColor={isSaved ? "#ab8bff" : "#A8B5DB"} 
            />
            <Text className={`text-sm ${isSaved ? 'text-[#ab8bff]' : 'text-white'} text-center`}>
              {isSaved ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">
              {movie?.runtime} minutes
            </Text>
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded md gap-x-1 mt-2 text-white text-sm">
            <Image source={icon} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0 * 10) / 2}/5
            </Text>
            <Text className="text-light-200 text-sm">
              {movie?.vote_count} votes
            </Text>
          </View>
          <MovieInfo label="Overview" value={movie?.overview ?? 'N/A'} />
          <MovieInfo label="Genres" value={movie?.genres?.map((genre) => genre.name).join(" - ") || 'N/A'} />
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo label="Budget" value={formatCurrency(movie?.budget)} />
            <MovieInfo label="Revenue" value={formatCurrency(movie?.revenue)} />
          </View>
          <MovieInfo label="Production Companies" value={movie?.production_companies?.map((company) => company.name).join(" - ") || 'N/A'} />
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
      >
        <Image source={arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff" />
        <Text className="text white font-semibold text-base">
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
