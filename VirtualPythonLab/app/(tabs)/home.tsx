import { View, Text } from 'react-native';
import { Welcome } from '@/components/Welcome';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Welcome />
    </View>
  );
}