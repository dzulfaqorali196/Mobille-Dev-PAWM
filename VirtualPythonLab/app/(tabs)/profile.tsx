import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { COURSES } from '../../constants/courses';
import { CourseProgress, SectionProgress } from '../../types/course';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    try {
      // Load course progress
      const { data: courseData, error: courseError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user?.id);

      if (courseError) throw courseError;
      setCourseProgress(courseData || []);

      // Load section progress
      const { data: sectionData, error: sectionError } = await supabase
        .from('section_progress')
        .select('*')
        .eq('user_id', user?.id);

      if (sectionError) throw sectionError;
      setSectionProgress(sectionData || []);
    } catch (error) {
      console.error('Error loading progress:', error);
      Alert.alert('Error', 'Gagal memuat progress');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Gagal keluar dari akun');
    }
  };

  const getCompletedSections = (courseCode: string) => {
    return sectionProgress.filter(
      p => p.course_code === courseCode && p.is_completed
    ).length;
  };

  const getTotalSections = (courseCode: string) => {
    const course = COURSES.find(c => c.code === courseCode);
    return course?.sections.length || 0;
  };

  if (!user) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText style={styles.message}>
          Silakan login untuk melihat profil Anda
        </ThemedText>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profil',
          headerShown: true,
        }}
      />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <IconSymbol name="person.circle.fill" size={80} color="#66c0f4" />
          <ThemedView style={styles.userInfo}>
            <ThemedText style={styles.name}>{user.email}</ThemedText>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <ThemedText style={styles.signOutText}>Keluar</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.stats}>
          <ThemedText style={styles.statsTitle}>Statistik Pembelajaran</ThemedText>
          <ThemedView style={styles.statsGrid}>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statNumber}>
                {courseProgress.length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Kursus Dimulai</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statNumber}>
                {courseProgress.filter(p => p.is_completed).length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Kursus Selesai</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statNumber}>
                {sectionProgress.filter(p => p.is_completed).length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Materi Selesai</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.progress}>
          <ThemedText style={styles.progressTitle}>Progress Kursus</ThemedText>
          {COURSES.map(course => {
            const progress = courseProgress.find(p => p.course_code === course.code);
            const completedSections = getCompletedSections(course.code);
            const totalSections = getTotalSections(course.code);
            const percentage = Math.round((completedSections / totalSections) * 100) || 0;

            return (
              <TouchableOpacity
                key={course.code}
                style={styles.courseCard}
                onPress={() => router.push(`/learn/${course.code}`)}
              >
                <ThemedView style={styles.courseInfo}>
                  <ThemedText style={styles.courseTitle}>{course.title}</ThemedText>
                  <ThemedText style={styles.courseStats}>
                    {completedSections} dari {totalSections} materi selesai
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.progressBar}>
                  <ThemedView 
                    style={[
                      styles.progressFill,
                      { width: `${percentage}%` },
                      percentage === 100 && styles.progressComplete,
                    ]} 
                  />
                </ThemedView>
                <ThemedText style={styles.progressText}>{percentage}%</ThemedText>
              </TouchableOpacity>
            );
          })}
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
    padding: 20,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#66c0f4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  signOutButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F44336',
    borderRadius: 6,
  },
  signOutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  stats: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#66c0f4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  progress: {
    padding: 20,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  courseInfo: {
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  courseStats: {
    fontSize: 14,
    opacity: 0.8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#66c0f4',
    borderRadius: 3,
  },
  progressComplete: {
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#66c0f4',
  },
}); 