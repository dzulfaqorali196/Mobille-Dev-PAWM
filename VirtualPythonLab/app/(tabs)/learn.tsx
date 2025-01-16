import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, Dimensions, View, Text } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { Course, CourseProgress } from '../../types/course';
import { COURSES } from '../../constants/courses';
import { useTheme } from '../../lib/ThemeContext';
import { Stack } from 'expo-router';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

export default function LearnScreen() {
  const { user } = useAuth();
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const progressMap = (data || []).reduce((acc: Record<string, CourseProgress>, curr) => {
        acc[curr.course_code] = curr;
        return acc;
      }, {});

      setCourseProgress(progressMap);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  }, []);

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

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <IconSymbol name="arrow.clockwise" size={40} color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Memuat Materi...
        </Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: isDark ? '#1b2838' : colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Materi',
          headerShown: true,
        }}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
          />
        }
      >
        {COURSES.map(course => {
          const progress = courseProgress[course.code];
          return (
            <Link
              key={course.code}
              href={{
                pathname: `/(learn)/${course.code}`,
              }}
              asChild
            >
              <TouchableOpacity>
                <ThemedView style={[styles.courseCard, { 
                  backgroundColor: isDark ? '#2a475e' : colors.card,
                  borderLeftWidth: 3,
                  borderLeftColor: course.level === 'beginner' ? '#4CAF50' : 
                                  course.level === 'intermediate' ? '#FFC107' : '#F44336'
                }]}>
                  {course.thumbnail_url ? (
                    <Image
                      source={{ uri: course.thumbnail_url }}
                      style={styles.thumbnail}
                    />
                  ) : (
                    <View style={[styles.placeholderThumbnail, { backgroundColor: isDark ? '#1b2838' : colors.border }]}>
                      <IconSymbol 
                        name={course.code === 'PY001' ? 'book.fill' : 'doc.text.fill'} 
                        size={40} 
                        color={colors.primary} 
                      />
                    </View>
                  )}
                  <View style={styles.courseInfo}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.courseTitle, { color: isDark ? '#c7d5e0' : colors.text }]}>
                        {course.title}
                      </Text>
                      <View style={[
                        styles.levelBadge,
                        {
                          backgroundColor:
                            course.level === 'beginner'
                              ? '#4CAF50'
                              : course.level === 'intermediate'
                              ? '#FFC107'
                              : '#F44336',
                        }
                      ]}>
                        <Text style={styles.levelText}>
                          {course.level === 'beginner' ? 'Beginner' :
                           course.level === 'intermediate' ? 'Intermediate' : 'Advanced'}
                        </Text>
                      </View>
                    </View>
                    <Text 
                      style={[
                        styles.courseDescription, 
                        { color: isDark ? '#8f98a0' : colors.text, opacity: 0.8 }
                      ]} 
                      numberOfLines={2}
                    >
                      {course.description}
                    </Text>
                    <View style={styles.courseFooter}>
                      <View style={styles.metadataItem}>
                        <IconSymbol name="clock" size={16} color={isDark ? '#8f98a0' : colors.text} />
                        <Text style={[
                          styles.metadataText, 
                          { color: isDark ? '#8f98a0' : colors.text }
                        ]}>
                          {course.duration}
                        </Text>
                      </View>
                      {progress && (
                        <Text style={[styles.progressText, { color: colors.primary }]}>
                          {progress.progress_percentage}% Selesai
                        </Text>
                      )}
                    </View>
                  </View>
                </ThemedView>
              </TouchableOpacity>
            </Link>
          );
        })}
      </ScrollView>
    </ThemedView>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  courseCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  placeholderThumbnail: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseInfo: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  courseDescription: {
    fontSize: 14,
    marginBottom: 16,
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
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 