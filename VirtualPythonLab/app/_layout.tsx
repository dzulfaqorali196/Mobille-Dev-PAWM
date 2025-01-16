import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/AuthContext';
import { ThemeProvider } from '@react-navigation/native';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider 
        value={{ 
          dark: false, 
          colors: {
            primary: '#007AFF',
            background: '#FFFFFF',
            card: '#FFFFFF',
            text: '#000000',
            border: '#E0E0E0',
            notification: '#FF3B30'
          },
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900',
            }
          }
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}