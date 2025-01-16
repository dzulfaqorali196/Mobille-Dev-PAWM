import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
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
    title: 'Pembelajaran Interaktif',
    description: 'Tutorial langkah demi langkah dengan latihan praktik',
    icon: 'book.closed.fill',
    color: '#4CAF50',
    route: '/learn',
  },
  {
    id: 2,
    title: 'Kode Langsung',
    description: 'Tulis dan uji kode secara langsung di aplikasi',
    icon: 'chevron.left.forwardslash.chevron.right',
    color: '#2196F3',
    route: '/code',
  },
  {
    id: 3,
    title: 'Pantau Progres',
    description: 'Pantau perjalanan belajar dan pencapaian Anda',
    icon: 'star.fill',
    color: '#9C27B0',
    route: '/profile',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.header}>
        <ThemedView style={styles.welcomeBox}>
          <IconSymbol name="hand.wave" size={32} color="#FFD700" />
          <ThemedText style={styles.welcomeTitle}>Selamat Datang di VPL!</ThemedText>
        </ThemedView>
        <ThemedText style={styles.welcomeText}>
          Perjalanan interaktif Anda untuk menguasai pemrograman Python dimulai di sini.
          Belajar, berlatih, dan buat proyek yang menakjubkan dengan cara yang menyenangkan.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Yang Kami Tawarkan</ThemedText>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  welcomeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
    lineHeight: 32,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 5,
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    lineHeight: 36,
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
    paddingRight: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    lineHeight: 24,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
});