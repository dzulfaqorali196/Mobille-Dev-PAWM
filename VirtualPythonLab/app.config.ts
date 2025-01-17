import 'dotenv/config';

export default {
  expo: {
    name: 'VirtualPythonLab',
    slug: 'virtualpythonlab',
    version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.dzulfaqor.virtualpythonlab'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.dzulfaqor.virtualpythonlab'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      'expo-router',
      'expo-splash-screen',
      'expo-font',
      'expo-secure-store'
    ],
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      judge0Api: process.env.EXPO_PUBLIC_JUDGE0_API,
      judge0Key: process.env.EXPO_PUBLIC_JUDGE0_KEY,
      eas: {
        projectId: '35131205-0798-4bc7-ba9a-906949edc5f7'
      }
    }
  }
}; 