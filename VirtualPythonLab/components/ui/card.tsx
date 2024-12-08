import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView, ThemedViewProps } from '@/components/ThemedView';

interface CardProps extends ThemedViewProps {
  className?: string;
}

export function Card({ children, style, ...props }: CardProps) {
  return (
    <ThemedView 
      style={[styles.card, style]} 
      lightColor="rgba(255, 255, 255, 0.8)"
      darkColor="rgba(30, 30, 30, 0.8)"
      {...props}
    >
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 