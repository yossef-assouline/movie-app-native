import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import icon from "@/assets/icons/star.png";
import arrow from "@/assets/icons/arrow.png";
import { useRouter } from "expo-router";
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
const MovieDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );
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
        <View className="flex-col items-start justify-center mt-5 px-5">
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
          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo label="Genres" value={movie?.genres?.map((genre) => genre.name).join(" - ") || 'N/A'} />
            <View className="flex flex-row justify-between w-1/2">
              <MovieInfo label="Budget" value={`$${movie?.budget && movie.budget >= 1_000_000_000 ? (movie.budget / 1_000_000_000).toFixed(1) + ' billion' : (movie?.budget / 1_000_000).toFixed(0) + ' million'}`} />
              <MovieInfo label="Revenue" value={`$${movie?.revenue && movie.revenue >= 1_000_000_000 ? (movie.revenue / 1_000_000_000).toFixed(1) + ' billion' : (movie?.revenue / 1_000_000).toFixed(0) + ' million'}`} />
            </View>
            <MovieInfo label="Production Companies" value={movie?.production_companies?.map((company) => company.name).join(" - ") || 'N/A'} />
          
        </View>
      </ScrollView>
            <TouchableOpacity
            onPress={() => router.back()}
             className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50">
              <Image source={arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff" />
              <Text className="text white font-semibold text-base">
               Go Back
              </Text>
            </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
