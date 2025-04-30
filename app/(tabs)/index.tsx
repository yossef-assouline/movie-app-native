import { Text, View, Image, ScrollView, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { FlatList } from "react-native";
import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";
export default function Index() {
  const router = useRouter();
  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(getTrendingMovies);
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 mt-20 mb-5 mx-auto" />
        <SearchBar
                onPress={() => router.push("/search")}
                placeholder="Search for a movie"
              />
        {moviesLoading || trendingMoviesLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingMoviesError ? (
          <Text className="text-white">Error: {moviesError?.message || trendingMoviesError?.message}</Text>
        ) : (
          <>
            {trendingMoviesLoading ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="mt-10 self-center"
              />
            ) : trendingMoviesError ? (
              <Text className="text-white">
                Error: {trendingMoviesError.message}
              </Text>
            ) : (
              <View className=" mt-5">
                <Text className="text-white text-2xl font-bold mt-5 mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  className="mb-4 mt-3"
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  data={trendingMovies}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item , index }) => (
                    <TrendingCard
                      movie={item}
                      index={index}
                    />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                />
              </View>
            )}
            <View className="flex-1 mt-5">
              
              <>
                <Text className="text-white text-2xl font-bold mt-5 mb-3">
                  Latest Movies
                </Text>
                <FlatList
                  scrollEnabled={false}
                  className="mt-2 pb-32"
                  data={movies}
                  renderItem={({ item }) => (
                    <MovieCard
                      id={item.id}
                      poster_path={item.poster_path}
                      title={item.title}
                      vote_average={item.vote_average}
                      release_date={item.release_date}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10,
                  }}
                />
              </>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
