import React from 'react';
import { StyleSheet, Pressable, Dimensions } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { HelloWave } from '@/components/HelloWave';
import Animated, { 
  useAnimatedStyle,
  withSpring, 
  withDelay,
  withTiming,
  Easing
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(ThemedView);
const { width } = Dimensions.get('window');

const FeatureCard = ({ icon, title, description, index }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withDelay(index * 300, withSpring(1)),
    transform: [
      { 
        translateY: withDelay(
          index * 300, 
          withSpring(0, { damping: 15 })
        ) 
      }
    ]
  }));

  const getIconName = () => {
    switch (title) {
      case "Interactive Learning":
        return "graduationcap";
      case "Live Coding":
        return "chevron.left.forwardslash.chevron.right";
      case "Track Progress":
        return "chart.bar.fill";
      default:
        return "questionmark";
    }
  };

  return (
    <AnimatedView style={[styles.featureCard, animatedStyle, { opacity: 0, transform: [{ translateY: 50 }] }]}>
      <ThemedView style={styles.iconWrapper}>
        <IconSymbol 
          size={28} 
          name={getIconName()} 
          color="#66c0f4" 
        />
      </ThemedView>
      <ThemedView style={styles.featureContent}>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={styles.featureDescription}>{description}</ThemedText>
      </ThemedView>
    </AnimatedView>
  );
};

export default function HomeScreen() {
  const headerAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1, { damping: 15 }) }],
    opacity: withTiming(1, { duration: 1000, easing: Easing.ease })
  }));

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1a1a1a', dark: '#1a1a1a' }}
      headerMaxHeight={200}
      headerMinHeight={100}
      contentContainerStyle={styles.scrollContent}
      headerImage={
        <AnimatedView style={[styles.headerContainer, headerAnimated, { opacity: 0 }]}>
          <IconSymbol
            size={60}
            color="#66c0f4"
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerIcon}
          />
        </AnimatedView>
      }>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.welcomeSection}>
          <HelloWave style={styles.wave} />
          <ThemedView style={styles.badgeContainer}>
            <ThemedText style={styles.badge}>Welcome to VPL!</ThemedText>
          </ThemedView>
          <ThemedText style={styles.description}>
            Your interactive journey to master Python programming starts here. Learn, practice, and create amazing projects in a fun and engaging way.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.featuresSection}>
          <ThemedText style={styles.sectionTitle}>What We Offer</ThemedText>
          
          <FeatureCard
            index={0}
            title="Interactive Learning"
            description="Step-by-step tutorials with hands-on exercises"
          />
          
          <FeatureCard
            index={1}
            title="Live Coding"
            description="Write and test code directly in the app"
          />
          
          <FeatureCard
            index={2}
            title="Track Progress"
            description="Monitor your learning journey and achievements"
          />
        </ThemedView>

        <ThemedView style={styles.ctaSection}>
          <ThemedText style={styles.ctaTitle}>Ready to Start?</ThemedText>
          <ThemedText style={styles.ctaDescription}>
            Head to the Learn section and begin your Python programming adventure!
          </ThemedText>
          <Pressable>
            <ThemedView style={styles.ctaButton}>
              <ThemedText style={styles.ctaButtonText}>Start Learning</ThemedText>
              <IconSymbol size={20} name="arrow.right" color="#ffffff" />
            </ThemedView>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 180,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  headerIcon: {
    marginTop: 20,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  wave: {
    marginRight: 8,
  },
  badgeContainer: {
    backgroundColor: '#66c0f4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badge: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  featuresSection: {
    gap: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(102, 192, 244, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  ctaSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#66c0f4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});