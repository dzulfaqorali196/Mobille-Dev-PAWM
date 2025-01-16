// app/screens/login.tsx
import { View } from 'react-native';
import { LoginForm } from '@/components/LoginForm';

export default function LoginScreen() {
  return (
    <View className="flex-1">
      <LoginForm />
    </View>
  );
}