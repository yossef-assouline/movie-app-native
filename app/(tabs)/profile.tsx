import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Models } from "react-native-appwrite";
import { login, register, logout, checkAuth , getUser} from "@/services/appwrite";
import ProfileInfo from "@/components/ProfileInfo";

const Profile = () => {
  const [loggedInUser, setLoggedInUser] =
    useState<Models.User<Models.Preferences> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        setIsLoading(true);
        const user = await getUser();
        setLoggedInUser(user);
      } catch (error) {
        setLoggedInUser(null);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserAuth();
  }, []);

  const handleLogout = async () => {
    await logout();
    setLoggedInUser(null);
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const user = await login(email, password);
      setLoggedInUser(user);
      
      if (user) {
        setLoggedInUser(user);
        setIsLoading(false);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error(error);
    }
  };
 
  const handleRegister = async () => {
    try {
      const user = await register(email, password, name);
      setLoggedInUser(user);
      if (user) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderAuthForm = () => {
    if (isRegister) {
      return (
        <>
          <TextInput
            className="border-2 border-gray-300 rounded-md p-2 text-white w-2/3"
            placeholderTextColor="white"
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            className="border-2 border-gray-300 rounded-md p-2 text-white w-2/3"
            placeholderTextColor="white"
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            className="border-2 border-gray-300 rounded-md p-2 text-white w-2/3"
            placeholderTextColor="white"
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <TouchableOpacity
            className="bg-[#ab8bff] rounded-md p-2 w-2/3"
            onPress={handleRegister}
          >
            <Text className="text-white text-center">Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsRegister(false)}>
            <Text className="text-white mt-2">Already have an account? Login</Text>
          </TouchableOpacity>
        </>
      );
    }

    return (
      <>
        <TextInput
          className="border-2 border-gray-300 rounded-md p-2 text-white w-2/3"
          placeholderTextColor="gray"
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          className="border-2 border-gray-300 rounded-md p-2 text-white w-2/3"
          placeholderTextColor="gray"
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <TouchableOpacity
          className="bg-[#ab8bff] rounded-md p-2 w-2/3"
          onPress={handleLogin}
        >
          <Text className="text-white text-center">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsRegister(true)}>
          <Text className="text-white mt-2">No account? Register</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <SafeAreaView className="flex items-center justify-center h-full gap-2 bg-dark-200">
      {isLoading ? (
        <ActivityIndicator size="large" color="white" />
      ) : loggedInUser ? (
        <View className="flex items-center justify-center h-full gap-2 bg-dark-200">
          <ProfileInfo profile={loggedInUser} />
          <TouchableOpacity className="bg-red-500 rounded-md p-2 w-2/3" onPress={handleLogout}>
            <Text className="text-white">Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderAuthForm()
      )}
    </SafeAreaView>
  );
};

export default Profile;
