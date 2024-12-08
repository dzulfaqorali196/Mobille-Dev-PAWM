import React from 'react';
import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function CodeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#66c0f4', dark: '#1b2838' }}
      headerMaxHeight={280}
      headerMinHeight={120}
      headerImage={
        <IconSymbol
          size={80}
          color="#1b2838"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerIcon}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Python Playground</ThemedText>
        <ThemedText style={styles.subtitle}>Write, test, and run your code</ThemedText>
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