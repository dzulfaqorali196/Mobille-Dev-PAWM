import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { Course, CourseSection, CourseProgress, SectionProgress } from '../../types/course';
import { COURSES } from '../../constants/courses';
import Markdown from 'react-native-markdown-display';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [sectionProgress, setSectionProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      // Load course from constants
      const courseData = COURSES.find(c => c.code === id);
      if (!courseData) {
        throw new Error('Course not found');
      }
      setCourse(courseData);

      if (user) {
        // Load course progress
        const { data: progressData, error: progressError } = await supabase
          .from('course_progress')
          .select('*')
          .eq('course_code', id)
          .eq('user_id', user.id)
          .single();

        if (!progressError) {
          setProgress(progressData);
        }

        // Load section progress
        const { data: sectionProgressData, error: sectionProgressError } = await supabase
          .from('section_progress')
          .select('*')
          .eq('course_code', id)
          .eq('user_id', user.id);

        if (!sectionProgressError) {
          const progressMap = (sectionProgressData || []).reduce((acc: Record<string, boolean>, curr: SectionProgress) => {
            acc[curr.section_id] = curr.is_completed;
            return acc;
          }, {});
          setSectionProgress(progressMap);
        }
      }
    } catch (error) {
      console.error('Error loading course:', error);
      Alert.alert('Error', 'Gagal memuat materi');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSectionPress = (section: CourseSection) => {
    if (section.type === 'text') {
      setSelectedSection(section);
    } else {
      startSection(section);
    }
  };

  const startSection = async (section: CourseSection) => {
    if (!user || !course) return;

    try {
      // Create or update course progress
      const courseProgressData = {
        user_id: user.id,
        course_code: course.code,
        last_section_id: section.id,
        progress_percentage: Math.round((Object.values(sectionProgress).filter(Boolean).length / course.sections.length) * 100),
        is_completed: false,
        last_accessed_at: new Date().toISOString(),
      };

      const { error: progressError } = await supabase
        .from('course_progress')
        .upsert(courseProgressData);

      if (progressError) throw progressError;

      // Create section progress if not exists
      const { error: sectionProgressError } = await supabase
        .from('section_progress')
        .upsert({
          user_id: user.id,
          course_code: course.code,
          section_id: section.id,
          is_completed: false,
        });

      if (sectionProgressError) throw sectionProgressError;

      // Navigate to the appropriate screen based on section type
      switch (section.type) {
        case 'quiz':
          router.push({
            pathname: `/(quiz)/${section.id}`,
            params: {
              courseCode: course.code,
              sectionId: section.id,
              title: section.title,
            }
          });
          break;
        case 'code':
          router.push({
            pathname: `/(code)/${section.id}`,
            params: {
              courseCode: course.code,
              sectionId: section.id,
              title: section.title,
            }
          });
          break;
        case 'text':
          setSelectedSection(section);
          break;
        default:
          Alert.alert('Info', 'Tipe materi ini belum tersedia');
      }
    } catch (error) {
      console.error('Error starting section:', error);
      Alert.alert('Error', 'Gagal memulai materi');
    }
  };

  const renderSectionContent = () => {
    if (!selectedSection) return null;

    return (
      <ThemedView style={styles.sectionContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setSelectedSection(null)}
        >
          <IconSymbol name="chevron.left" size={24} color="#66c0f4" />
          <ThemedText style={styles.backText}>Kembali ke Daftar Materi</ThemedText>
        </TouchableOpacity>
        <ScrollView 
          style={styles.markdownContainer}
          contentContainerStyle={{ 
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.contentHeader}>
            <ThemedText style={styles.contentTitle}>{selectedSection.title}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.contentBody}>
            <Markdown 
              style={markdownStyles}
              mergeStyle={true}
            >
              {selectedSection.content}
            </Markdown>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    );
  };

  if (loading || !course) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <IconSymbol name="arrow.clockwise" size={40} color="#66c0f4" />
        <ThemedText style={styles.loadingText}>Memuat Materi...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: course.title,
          headerShown: true,
        }}
      />
      {selectedSection ? (
        renderSectionContent()
      ) : (
        <ScrollView style={styles.container}>
          <ThemedView style={styles.header}>
            <ThemedText style={styles.title}>{course.title}</ThemedText>
            <ThemedText style={styles.description}>{course.description}</ThemedText>
            <ThemedView style={styles.metadata}>
              <ThemedView style={styles.metadataItem}>
                <IconSymbol name="clock.fill" size={16} color="#66c0f4" />
                <ThemedText style={styles.metadataText}>
                  {course.estimated_time}
                </ThemedText>
              </ThemedView>
              <ThemedView
                style={[
                  styles.levelBadge,
                  {
                    backgroundColor:
                      course.level === 'beginner'
                        ? '#4CAF50'
                        : course.level === 'intermediate'
                        ? '#FFC107'
                        : '#F44336',
                  },
                ]}
              >
                <ThemedText style={styles.levelText}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.sections}>
            <ThemedText style={styles.sectionTitle}>Daftar Materi</ThemedText>
            {course.sections.map((section, index) => (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.sectionItem,
                  { borderLeftColor: 
                    section.type === 'quiz' ? '#FFC107' :
                    section.type === 'code' ? '#F44336' :
                    '#66c0f4'
                  }
                ]}
                onPress={() => handleSectionPress(section)}
              >
                <ThemedView style={styles.sectionHeader}>
                  <ThemedView style={styles.sectionInfo}>
                    <ThemedView style={[
                      styles.sectionIcon,
                      {
                        backgroundColor: 
                          section.type === 'quiz' ? 'rgba(255, 193, 7, 0.1)' :
                          section.type === 'code' ? 'rgba(244, 67, 54, 0.1)' :
                          'rgba(102, 192, 244, 0.1)',
                      }
                    ]}>
                      {section.type === 'quiz' ? (
                        <IconSymbol name="questionmark.circle.fill" size={24} color="#FFC107" />
                      ) : section.type === 'code' ? (
                        <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color="#F44336" />
                      ) : (
                        <IconSymbol name="doc.text" size={24} color="#66c0f4" />
                      )}
                    </ThemedView>
                    <ThemedView>
                      <ThemedText style={styles.sectionName}>
                        {section.title}
                      </ThemedText>
                      <ThemedText style={[
                        styles.sectionType,
                        {
                          color: 
                            section.type === 'quiz' ? '#FFC107' :
                            section.type === 'code' ? '#F44336' :
                            '#66c0f4'
                        }
                      ]}>
                        {section.type === 'text' ? 'Materi'
                          : section.type === 'quiz' ? 'Kuis'
                          : section.type === 'code' ? 'Latihan'
                          : section.type === 'video' ? 'Video'
                          : 'Materi'}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  {sectionProgress[section.id] ? (
                    <IconSymbol name="checkmark.circle.fill" size={24} color="#4CAF50" />
                  ) : (
                    <IconSymbol 
                      name="chevron.right" 
                      size={24} 
                      color={
                        section.type === 'quiz' ? '#FFC107' :
                        section.type === 'code' ? '#F44336' :
                        '#66c0f4'
                      } 
                    />
                  )}
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ScrollView>
      )}
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 20,
  },
  metadata: {
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
  sections: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderLeftWidth: 3,
    borderLeftColor: '#66c0f4',
  },
  sectionHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(102, 192, 244, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionType: {
    fontSize: 12,
    opacity: 0.6,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  sectionContent: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backText: {
    fontSize: 16,
    color: '#66c0f4',
    fontWeight: '500',
  },
  markdownContainer: {
    flex: 1,
  },
  contentHeader: {
    marginBottom: 24,
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#66c0f4',
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  contentTypeText: {
    fontSize: 14,
    color: '#66c0f4',
    fontWeight: '500',
  },
  contentBody: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
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
  bullet_list: {
    marginBottom: 16,
  },
  ordered_list: {
    marginBottom: 16,
  },
  list_item: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    opacity: 0.9,
  },
  code_inline: {
    color: '#66c0f4',
    backgroundColor: 'rgba(102, 192, 244, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: 'rgba(102, 192, 244, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    fontFamily: 'monospace',
    color: '#66c0f4',
  },
  fence: {
    backgroundColor: 'rgba(102, 192, 244, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    fontFamily: 'monospace',
    color: '#66c0f4',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  strong: {
    fontWeight: 'bold',
    color: '#fff',
  },
  em: {
    fontStyle: 'italic',
    color: '#fff',
    opacity: 0.9,
  },
  link: {
    color: '#66c0f4',
    textDecorationLine: 'underline',
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#66c0f4',
    paddingLeft: 16,
    marginLeft: 0,
    marginVertical: 16,
    opacity: 0.9,
  },
  image: {
    maxWidth: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 16,
  },
} as const; 