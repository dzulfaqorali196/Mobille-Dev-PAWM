import React from 'react';
import { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { ThemedView } from '@/components/ThemedView';
import Animated from 'react-native-reanimated';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function SplashScreen() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        scale.value = withSpring(1, { damping: 15 });
        opacity.value = withTiming(1, { duration: 1000 });
        translateY.value = withTiming(0, { 
          duration: 1000,
          easing: Easing.out(Easing.exp)
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn('An error occurred:', error);
      } finally {
        await ExpoSplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.logoContainer}>
        <AnimatedView style={[styles.circle, circleStyle]}>
          <Text style={styles.logoText}>VPL</Text>
        </AnimatedView>
      </ThemedView>
      <AnimatedText style={[styles.title, textStyle]}>
        Virtual Python Lab
      </AnimatedText>
      <AnimatedText style={[styles.subtitle, textStyle]}>
        Learn • Code • Create
      </AnimatedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a475e',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circle: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: '#66c0f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#66c0f4',
  },
}); 

export default SplashScreen; 