import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export type Theme = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#66c0f4',
    background: '#ffffff',
    card: '#ffffff',
    text: '#000000',
    border: '#e1e1e1',
    notification: '#ff3b30',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#66c0f4',
    background: '#171a21',
    card: '#2a475e',
    text: '#ffffff',
    border: '#2a475e',
    notification: '#ff453a',
  },
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: Theme['colors'];
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
  colors: lightTheme.colors,
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(colorScheme === 'dark' ? darkTheme : lightTheme);

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(theme.dark ? lightTheme : darkTheme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        toggleTheme, 
        colors: theme.colors,
        isDark: theme.dark
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 