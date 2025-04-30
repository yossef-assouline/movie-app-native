import { Text, View, Image } from 'react-native'
import React from 'react'
import { Models } from 'react-native-appwrite'

const ProfileInfo = ({profile}: {profile: Models.User<Models.Preferences>}) => {
  // Function to generate a random color
  const getRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
      '#D4A5A5', '#9B59B6', '#3498DB', '#1ABC9C', '#F1C40F'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Get the first letter of the name
  const firstLetter = profile.name ? profile.name.charAt(0).toUpperCase() : '?';
  const backgroundColor = getRandomColor();

  return (
    <View className='flex items-center justify-center gap-2'>
      <View 
        className='w-20 h-20 rounded-full items-center justify-center'
        style={{ backgroundColor }}
      >
        <Text className='text-white text-3xl font-bold'>{firstLetter}</Text>
      </View>
      <Text className='text-white text-lg font-bold'>{profile.name}</Text>
      <Text className='text-white text-sm'>{profile.email}</Text>
    </View>
  )
}

export default ProfileInfo

