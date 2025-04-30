import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSavedMovies } from "@/services/appwrite";
import { FlatList, Image ,ScrollView } from "react-native";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import { images } from "@/constants/images";
import { icons  } from "@/constants/icons";

const saved = () => {
  const {
    data: savedMovies,
    loading: isLoading,
    error,
  } = useFetch(getSavedMovies);
  
 
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <SafeAreaView className="flex items-center justify-center h-full">
      <ScrollView
        className="flex-1 px-5  w-full"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 mt-20 mb-5 mx-auto" />
        <Text className="text-white text-2xl font-bold mt-5 mb-3">Saved Movies</Text>
        <>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              className="mt-10 self-center"
            />
          ) : (
            <FlatList
                  scrollEnabled={false}
                  className="mt-2 pb-32"
                  data={savedMovies}
                  renderItem={({ item }) => (
                    <>

                    <MovieCard
                      id={item.movieId}
                      poster_path={item.posterPath}
                      title={item.title}
                   
                      release_date={item.releaseDate}
                      savedPage={true}
                    />
                    
                    </>
                  )}
                  keyExtractor={(item) => item.movieId}
                  numColumns={3}
                  ListEmptyComponent={<Text className="text-white text-2xl font-bold mt-5 mb-3">No saved movies</Text>}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10,
                  }}
                />
          )}
        </>
      </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default saved;
