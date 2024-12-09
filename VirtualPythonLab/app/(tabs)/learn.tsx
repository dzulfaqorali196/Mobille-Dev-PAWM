import React from 'react';
import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function LearnScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#66c0f4', dark: '#1b2838' }}
      headerMaxHeight={280}
      headerMinHeight={120}
      headerImage={
        <IconSymbol
          size={80}
          color="#1b2838"
          name="book.fill"
          style={styles.headerIcon}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Python Learning Path</ThemedText>
        <ThemedText style={styles.subtitle}>Start your journey here</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerIcon: {
    marginTop: 65,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
  },
}); 