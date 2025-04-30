import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const saved = () => {
  return (
    <SafeAreaView className='flex items-center justify-center h-full'>
      <View>
        <Text>Saved</Text>
      </View>
    </SafeAreaView>
  )
}

export default saved