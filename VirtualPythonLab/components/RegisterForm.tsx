import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      Alert.alert('Success', 'Registration successful! Please check your email for verification.');
      router.replace('/screens/login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center px-4">
      <TextInput
        className="h-12 border border-gray-300 rounded-lg px-4 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        className="h-12 border border-gray-300 rounded-lg px-4 mb-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className="h-12 bg-blue-500 rounded-lg items-center justify-center mb-4"
        onPress={handleRegister}
        disabled={loading}
      >
        <Text className="text-white font-medium">
          {loading ? 'Loading...' : 'Register'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/screens/login')}
      >
        <Text className="text-center text-blue-500">
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
