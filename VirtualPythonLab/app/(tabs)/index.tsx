import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, ScrollView, View, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol, IconSymbolName } from '../../components/ui/IconSymbol';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../lib/ThemeContext';

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
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.welcomeSection, { backgroundColor: colors.card }]}>
        <IconSymbol name="hand.wave" size={100} color={colors.text} style={styles.waveIcon} />
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Selamat Datang di VPL
        </Text>
        <Text style={[styles.welcomeDescription, { color: colors.text }]}>
          Perjalanan interaktif Anda untuk menguasai pemrograman Python dimulai di sini. Belajar, berlatih, dan buat proyek yang menakjubkan dengan cara yang menyenangkan.
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Yang Kami Tawarkan</Text>

      <View style={styles.featuresContainer}>
        {features.map((feature) => (
          <TouchableOpacity 
            key={feature.id}
            style={[styles.featureCard, { backgroundColor: colors.card }]}
            onPress={() => router.push(feature.route)}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${feature.color}10` }]}>
              <IconSymbol name={feature.icon} size={32} color={feature.color} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.text }]}>
                {feature.description}
              </Text>
            </View>
            <IconSymbol 
              name="chevron.right" 
              size={24} 
              color={colors.primary}
              style={styles.arrowIcon} 
            />
          </TouchableOpacity>
        ))}
      </View>
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
  waveIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeSection: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 5,
  },
  welcomeDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    paddingHorizontal: 5,
  },
  featuresContainer: {
    gap: 15,
  },
  arrowIcon: {
    marginLeft: 10,
  },
});