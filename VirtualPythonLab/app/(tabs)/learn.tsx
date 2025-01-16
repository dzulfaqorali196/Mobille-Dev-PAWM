import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { Course, CourseProgress } from '../../types/course';
import { COURSES } from '../../constants/courses';

const { width } = Dimensions.get('window');

export default function LearnScreen() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: progressData, error: progressError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      const progressMap = (progressData || []).reduce((acc: Record<string, CourseProgress>, curr: CourseProgress) => {
        acc[curr.course_code] = curr;
        return acc;
      }, {});

      setProgress(progressMap);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  };

  useEffect(() => {
    loadProgress();
  }, [user]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FFC107';
      case 'advanced':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const renderCourseCard = (course: Course) => {
    const courseProgress = progress[course.code];
    
    return (
      <TouchableOpacity
        key={course.code}
        style={styles.courseCard}
        onPress={() => router.push(`/(learn)/${course.code}`)}
        activeOpacity={0.7}
      >
        <ThemedView style={styles.thumbnailContainer}>
          {course.thumbnail_url ? (
            <Image 
              source={{ uri: course.thumbnail_url }} 
              style={styles.thumbnail}
              resizeMode="contain"
            />
          ) : (
            <ThemedView style={styles.placeholderThumbnail}>
              <IconSymbol name="book.fill" size={40} color="#66c0f4" />
              <ThemedText style={styles.placeholderText}>Python</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
        <ThemedView style={styles.courseInfo}>
          <ThemedView style={styles.courseHeader}>
            <ThemedText style={styles.courseTitle}>{course.title}</ThemedText>
            <ThemedView
              style={[
                styles.levelBadge,
                { backgroundColor: getLevelColor(course.level) },
              ]}
            >
              <ThemedText style={styles.levelText}>
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedText style={styles.courseDescription} numberOfLines={2}>
            {course.description}
          </ThemedText>
          
          <ThemedView style={styles.courseMetadata}>
            <ThemedView style={styles.metadataItem}>
              <IconSymbol name="clock.fill" size={16} color="#66c0f4" />
              <ThemedText style={styles.metadataText}>
                {course.estimated_time}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.metadataItem}>
              <IconSymbol name="book.fill" size={16} color="#66c0f4" />
              <ThemedText style={styles.metadataText}>
                {course.sections.length} Materi
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {courseProgress && (
            <ThemedView style={styles.progressContainer}>
              <ThemedView style={styles.progressBar}>
                <ThemedView
                  style={[
                    styles.progressFill,
                    { width: `${courseProgress.progress_percentage}%` },
                  ]}
                />
              </ThemedView>
              <ThemedText style={styles.progressText}>
                {courseProgress.progress_percentage}% Selesai
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <IconSymbol name="arrow.clockwise" size={40} color="#66c0f4" />
        <ThemedText style={styles.loadingText}>Memuat Materi...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Materi Pembelajaran</ThemedText>
        <ThemedText style={styles.subtitle}>
          Pelajari Python dari dasar hingga mahir
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.courseList}>
        {COURSES.map(renderCourseCard)}
      </ThemedView>
    </ScrollView>
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
    padding: 16,
    paddingTop: 24,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  courseList: {
    gap: 16,
  },
  courseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbnailContainer: {
    height: 160,
    backgroundColor: 'rgba(102, 192, 244, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  thumbnail: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  placeholderThumbnail: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#66c0f4',
  },
  courseInfo: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  courseDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
    lineHeight: 20,
  },
  courseMetadata: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
    opacity: 0.8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#66c0f4',
  },
  progressText: {
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'right',
  },
}); 