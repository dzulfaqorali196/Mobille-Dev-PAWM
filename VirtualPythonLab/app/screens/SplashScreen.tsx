import { useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  Easing
} from 'react-native-reanimated';
import * as ExpoSplashScreen from 'expo-splash-screen';

const { width } = Dimensions.get('window');
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function CustomSplashScreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      500,
      withSequence(
        withSpring(1, { damping: 15 }),
      )
    );
    
    scale.value = withDelay(
      500,
      withSpring(1, { damping: 15 })
    );

    textOpacity.value = withDelay(
      800,
      withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      { translateY: withSpring(textOpacity.value * 0, { damping: 15 }) }
    ],
  }));

  return (
    <View style={styles.container}>
      <MotiView
        from={{
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: 'timing',
          duration: 1000,
        }}
      >
        <Image 
          source={require('@/assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </MotiView>

      <AnimatedText style={[styles.text, textAnimatedStyle]}>
        Virton
      </AnimatedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2838',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 20,
  },
  text: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#66c0f4',
    marginTop: 20,
  },
});