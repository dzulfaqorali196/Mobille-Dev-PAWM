import { useColorScheme } from 'react-native';

interface Theme {
  colors: {
    text: string;
    background: string;
    primary: string;
    secondary: string;
  };
}

const lightTheme: Theme = {
  colors: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#66c0f4',
    secondary: '#4CAF50'
  }
};

const darkTheme: Theme = {
  colors: {
    text: '#FFFFFF',
    background: '#1a1a1a',
    primary: '#66c0f4',
    secondary: '#4CAF50'
  }
};

export function useTheme(): Theme {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
} 