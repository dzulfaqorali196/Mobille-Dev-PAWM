import { View, Text } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export function Welcome() {
  const { user } = useAuth();

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold mb-2">Welcome!</Text>
      <Text>You are logged in as {user?.email}</Text>
    </View>
  );
}