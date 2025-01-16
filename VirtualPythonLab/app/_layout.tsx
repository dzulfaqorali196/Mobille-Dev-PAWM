import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ThemeProvider as CustomThemeProvider, useTheme } from '../lib/ThemeContext';

// Fungsi untuk mengecek apakah user berada di grup autentikasi
function useProtectedRoute(user: any) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!user && !inAuthGroup) {
      // Redirect ke login jika tidak ada user dan tidak di halaman auth
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect ke home jika sudah login tapi masih di halaman auth
      router.replace('/(tabs)');
    }
  }, [user, segments]);
}

function RootLayoutNav() {
  const { user } = useAuth();
  const { isDark, colors } = useTheme();
  useProtectedRoute(user);

  return (
    <ThemeProvider
      value={{
        dark: isDark,
        colors: colors,
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
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(learn)" options={{ headerShown: false }} />
        <Stack.Screen name="(quiz)" options={{ headerShown: false }} />
        <Stack.Screen name="(code)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CustomThemeProvider>
          <RootLayoutNav />
        </CustomThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});