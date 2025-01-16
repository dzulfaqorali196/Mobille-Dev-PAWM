import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export function Profile() {
  const { signOut, user } = useAuth();

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-4">Profile</Text>
      <Text className="mb-2">Email: {user?.email}</Text>
      <TouchableOpacity
        className="h-12 bg-red-500 rounded-lg items-center justify-center"
        onPress={signOut}
      >
        <Text className="text-white font-medium">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}