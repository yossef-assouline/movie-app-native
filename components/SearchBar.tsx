import { View, Text, TextInput } from "react-native";
import React from "react";
import Search from "../assets/icons/search.png";
import { Image } from "react-native";
interface Props {
  onPress?: () => void;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({onPress, placeholder , value , onChangeText}: Props) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image
        source={Search}
        alt="search"
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#ab8bff"
        className="flex-1 ml-2 text-white"
      />
    </View>
  );
};

export default SearchBar;
