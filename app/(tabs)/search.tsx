import { Text, View, Image, ScrollView, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { FlatList } from "react-native";
import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import { updateSearchCount } from "@/services/appwrite";
export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    reset,
    refetch: loadMovies,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);
  useEffect(() => {
    if(movies?.length > 0 && movies?.[0]){
      updateSearchCount(searchQuery,movies[0]);
    }
  }, [movies]);
  useEffect(() => {   
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0 "
        resizeMode="cover"
      />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        ListEmptyComponent={
          !moviesLoading &&
          !moviesError ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500 text-center text-lg">
                {searchQuery.trim() ? "No movies found" : "Search for movies"}
              </Text>
            </View>
          ) : null
        }
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image
                source={icons.logo}
                className="w-12 h-10"
                resizeMode="contain"
              />
            </View>
            <View className="my-5">
              <SearchBar
                placeholder="Search movies..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>
            {moviesLoading && (
              <ActivityIndicator size="medium" color="white" className="my-3" />
            )}
            {moviesError && (
              <Text className="text-red-500 text-center text-lg">
                Error {moviesError.message}
              </Text>
            )}

            {!moviesLoading &&
              !moviesError &&
              searchQuery.trim() &&
              movies?.length > 0 && (
                <Text className="text-white text-xl font-bold mb-4">
                  Search results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
      />
    </View>
  );
}
