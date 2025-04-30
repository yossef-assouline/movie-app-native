import { View, Text } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
    return (
        <SafeAreaView className='flex items-center justify-center h-full'>
            <View>
                <Text>Profile</Text>
            </View>
        </SafeAreaView>
    )
}

export default Profile;