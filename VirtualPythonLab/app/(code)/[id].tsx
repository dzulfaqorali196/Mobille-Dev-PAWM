import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { COURSES } from '../../constants/courses';
import Markdown from 'react-native-markdown-display';
import { DragDropCode } from '../../components/DragDropCode';

export default function CodePracticeScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [section, setSection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSection();
  }, [id]);

  const loadSection = async () => {
    try {
      // Find the section from courses
      let foundSection = null;
      for (const course of COURSES) {
        const section = course.sections.find(s => s.id === id);
        if (section) {
          foundSection = section;
          break;
        }
      }

      if (!foundSection) {
        throw new Error('Section not found');
      }

      setSection(foundSection);
    } catch (error) {
      console.error('Error loading section:', error);
      Alert.alert('Error', 'Gagal memuat latihan');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (code: string) => {
    if (!user || !section) return;

    try {
      // Update section progress
      const { error: progressError } = await supabase
        .from('section_progress')
        .upsert({
          user_id: user.id,
          course_code: section.course_code,
          section_id: section.id,
          is_completed: true,
        });

      if (progressError) throw progressError;

      Alert.alert('Sukses', 'Latihan berhasil diselesaikan!');
      router.back();
    } catch (error) {
      console.error('Error submitting code:', error);
      Alert.alert('Error', 'Gagal menyimpan progres');
    }
  };

  if (loading || !section) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <IconSymbol name="arrow.clockwise" size={40} color="#66c0f4" />
        <ThemedText style={styles.loadingText}>Memuat Latihan...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: section.title,
          headerShown: true,
        }}
      />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>{section.title}</ThemedText>
          <ThemedText style={styles.description}>{section.description}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.practiceContainer}>
          <Markdown style={markdownStyles}>
            {section.content}
          </Markdown>

          <ThemedView style={styles.codeContainer}>
            <ThemedText style={styles.codeTitle}>Latihan Kode</ThemedText>
            <DragDropCode
              items={section.initial_code?.split('\n') || []}
              initialCode={section.initial_code || ''}
              onSubmit={handleCodeSubmit}
              testCases={section.test_cases || []}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    opacity: 0.8,
  },
  practiceContainer: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
  },
  codeContainer: {
    marginTop: 20,
  },
  codeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

const markdownStyles = {
  body: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 0,
  },
  heading2: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  heading3: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    opacity: 0.9,
  },
  list_item: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    opacity: 0.9,
  },
  code_inline: {
    color: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    fontFamily: 'monospace',
    color: '#F44336',
  },
  fence: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    fontFamily: 'monospace',
    color: '#F44336',
  },
} as const; 