import { Image, Text, View, ImageBackground } from 'react-native';
import { images } from '@/constants/images';

interface TabIconProps {
  focused: boolean;
  icon: string;
  label: string;
}

const TabIcon = ({ focused, icon, label }: TabIconProps) => {
  if (focused) {
    return (
      <ImageBackground 
        source={images.highlight} 
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      >
        <Image 
          source={icon} 
          tintColor="#151312" 
          className="size-5"
        />
        <Text className="text-secondary text-base font-semibold ml-2 text-primary">
          {label}
        </Text>
      </ImageBackground>
    );
  }
  
  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Image source={icon} tintColor="#A8B5DB" className="size-5"/>
    </View>
  );
};

export default TabIcon; 