import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol, IconSymbolName } from '../../components/ui/IconSymbol';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: IconSymbolName;
  color: string;
  route: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: 'Interactive Learning',
    description: 'Step-by-step tutorials with hands-on exercises',
    icon: 'book.closed.fill',
    color: '#4CAF50',
    route: '/learn',
  },
  {
    id: 2,
    title: 'Live Coding',
    description: 'Write and test code directly in the app',
    icon: 'chevron.left.forwardslash.chevron.right',
    color: '#2196F3',
    route: '/code',
  },
  {
    id: 3,
    title: 'Track Progress',
    description: 'Monitor your learning journey and achievements',
    icon: 'star.fill',
    color: '#9C27B0',
    route: '/profile',
  },
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.welcomeBox}>
          <IconSymbol name="hand.wave" size={32} color="#FFD700" />
          <ThemedText style={styles.welcomeTitle}>Welcome to VPL!</ThemedText>
        </ThemedView>
        <ThemedText style={styles.welcomeText}>
          Your interactive journey to master Python programming starts here.
          Learn, practice, and create amazing projects in a fun and engaging way.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>What We Offer</ThemedText>
        <ThemedView style={styles.featuresList}>
          {features.map((feature, index) => (
            <Link key={feature.id} href={feature.route} asChild>
              <AnimatedTouchableOpacity
                entering={FadeInDown.delay(index * 200)}
                style={styles.featureCard}
              >
                <ThemedView style={[styles.iconContainer, { backgroundColor: `${feature.color}20` }]}>
                  <IconSymbol name={feature.icon} size={32} color={feature.color} />
                </ThemedView>
                <ThemedView style={styles.featureContent}>
                  <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
                  <ThemedText style={styles.featureDescription}>{feature.description}</ThemedText>
                </ThemedView>
                <IconSymbol name="chevron.right" size={20} color="#666" />
              </AnimatedTouchableOpacity>
            </Link>
          ))}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  welcomeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featuresList: {
    gap: 15,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
});