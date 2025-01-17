import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, View, Text, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { Course, CourseSection, CourseProgress, SectionProgress } from '../../types/course';
import { COURSES } from '../../constants/courses';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../../lib/ThemeContext';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [sectionProgress, setSectionProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const { colors, isDark } = useTheme();

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
        } else if (progressError.code === 'PGRST116') {
          // Jika belum ada progress, buat baru
          const { data: newProgress, error: createError } = await supabase
            .from('course_progress')
            .upsert({
              user_id: user.id,
              course_code: id,
              progress_percentage: 0,
              last_section_id: courseData.sections[0].id,
              is_completed: false,
              last_accessed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (!createError) {
            setProgress(newProgress);
          }
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

  const handleSectionPress = async (section: CourseSection) => {
    if (!user || !course) return;

    try {
      // Update progress saat materi dibuka
      if (section.type === 'text') {
        const { error: sectionProgressError } = await supabase
          .from('section_progress')
          .upsert({
            user_id: user.id,
            course_code: course.code,
            section_id: section.id,
            is_completed: true,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,course_code,section_id'
          });

        if (sectionProgressError) throw sectionProgressError;

        // Fetch updated progress
        const { data: allProgress } = await supabase
          .from('section_progress')
          .select('*')
          .eq('course_code', course.code)
          .eq('user_id', user.id)
          .eq('is_completed', true);

        // Update progress percentage
        const completedSections = allProgress?.length || 0;
        const totalSections = course.sections.length;
        const newProgress = Math.min(Math.round((completedSections / totalSections) * 100), 100);

        // Update course progress
        const { data: updatedProgress, error: courseProgressError } = await supabase
          .from('course_progress')
          .upsert({
            user_id: user.id,
            course_code: course.code,
            progress_percentage: newProgress,
            last_section_id: section.id,
            is_completed: newProgress === 100,
            last_accessed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,course_code'
          })
          .select()
          .single();

        if (courseProgressError) throw courseProgressError;

        // Update local state
        setProgress(updatedProgress);
        setSectionProgress(prev => ({
          ...prev,
          [section.id]: true
        }));
      }

      // Navigate based on section type
      if (section.type === 'text') {
        setSelectedSection(section);
      } else {
        startSection(section);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const startSection = async (section: CourseSection) => {
    if (!user || !course) return;

    try {
      // Update progress saat quiz dimulai
      const { error: sectionProgressError } = await supabase
        .from('section_progress')
        .upsert({
          user_id: user.id,
          course_code: course.code,
          section_id: section.id,
          is_completed: true,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,course_code,section_id'
        });

      if (sectionProgressError) throw sectionProgressError;

      // Fetch updated progress
      const { data: allProgress } = await supabase
        .from('section_progress')
        .select('*')
        .eq('course_code', course.code)
        .eq('user_id', user.id)
        .eq('is_completed', true);

      // Update progress percentage
      const completedSections = allProgress?.length || 0;
      const totalSections = course.sections.length;
      const newProgress = Math.min(Math.round((completedSections / totalSections) * 100), 100);

      // Update course progress
      const { data: updatedProgress, error: courseProgressError } = await supabase
        .from('course_progress')
        .upsert({
          user_id: user.id,
          course_code: course.code,
          progress_percentage: newProgress,
          last_section_id: section.id,
          is_completed: newProgress === 100,
          last_accessed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,course_code'
        })
        .select()
        .single();

      if (courseProgressError) throw courseProgressError;

      // Update local state
      setProgress(updatedProgress);
      setSectionProgress(prev => ({
        ...prev,
        [section.id]: true
      }));

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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= 
      contentSize.height - paddingToBottom;

    if (isCloseToBottom) {
      setHasReachedBottom(true);
    }
  };

  const handleCompleteReading = async () => {
    if (!user || !course || !selectedSection) {
      Alert.alert('Error', 'Data tidak lengkap');
      return;
    }

    try {
      const { error } = await supabase
        .from('section_progress')
        .upsert({
          user_id: user.id,
          course_code: course.code,
          section_id: selectedSection.id,
          is_completed: true,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Fetch updated progress
      const { data: allProgress } = await supabase
        .from('section_progress')
        .select('*')
        .eq('course_code', course.code)
        .eq('user_id', user.id)
        .eq('is_completed', true);

      // Update progress percentage
      const completedSections = allProgress?.length || 0;
      const totalSections = course.sections.length;
      const newProgress = Math.min(Math.round((completedSections / totalSections) * 100), 100);

      // Update course progress
      await supabase
        .from('course_progress')
        .upsert({
          user_id: user.id,
          course_code: course.code,
          progress_percentage: newProgress,
          last_section_id: selectedSection.id,
          is_completed: newProgress === 100,
          updated_at: new Date().toISOString(),
        });

      Alert.alert(
        'Selamat! 🎉',
        'Anda telah menyelesaikan materi ini',
        [
          {
            text: 'OK',
            onPress: () => setSelectedSection(null)
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan progress');
    }
  };

  const renderSectionContent = () => {
    if (!selectedSection) return null;

    return (
      <ThemedView style={[styles.sectionContent, { backgroundColor: isDark ? '#1b2838' : colors.background }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: isDark ? '#2a475e' : colors.card }]}
          onPress={() => setSelectedSection(null)}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Kembali ke Daftar Materi</Text>
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
          <View style={[styles.contentHeader, { backgroundColor: isDark ? '#2a475e' : colors.card }]}>
            <View style={styles.contentType}>
              <IconSymbol 
                name="doc.text.fill" 
                size={16} 
                color={colors.primary} 
              />
              <Text style={[styles.contentTypeText, { color: colors.primary }]}>
                {selectedSection.type === 'quiz' ? 'Kuis' : 'Materi'}
              </Text>
            </View>
            <Text style={[styles.contentTitle, { color: isDark ? '#c7d5e0' : colors.text }]}>
              {selectedSection.title}
            </Text>
          </View>
          <View style={[styles.contentBody, { backgroundColor: isDark ? '#2a475e' : colors.card }]}>
            <Markdown 
              style={{
                body: { color: isDark ? '#c7d5e0' : colors.text },
                heading1: { color: isDark ? '#c7d5e0' : colors.text },
                heading2: { color: isDark ? '#c7d5e0' : colors.text },
                heading3: { color: isDark ? '#c7d5e0' : colors.text },
                paragraph: { color: isDark ? '#8f98a0' : colors.text, opacity: 0.9 },
                blockquote: { backgroundColor: isDark ? '#1b2838' : colors.border + '1A', borderColor: isDark ? '#2a475e' : colors.border },
                code_inline: { color: isDark ? '#c7d5e0' : colors.text, backgroundColor: isDark ? '#1b2838' : colors.border + '1A' },
                code_block: { backgroundColor: isDark ? '#1b2838' : colors.border + '1A' },
                fence: { backgroundColor: isDark ? '#1b2838' : colors.border + '1A' },
                list_item: { color: isDark ? '#8f98a0' : colors.text },
                bullet_list: { color: isDark ? '#8f98a0' : colors.text },
                ordered_list: { color: isDark ? '#8f98a0' : colors.text },
              }}
            >
              {selectedSection.content}
            </Markdown>
          </View>
        </ScrollView>
      </ThemedView>
    );
  };

  // Tambahkan useEffect untuk auto refresh progress setiap 5 detik
  useEffect(() => {
    if (!user || !course) return;

    const interval = setInterval(() => {
      loadCourse();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, course]);

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
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1b2838' : colors.background }]}>
          <View style={[styles.header, { 
            backgroundColor: isDark ? '#2a475e' : colors.card,
            borderBottomColor: isDark ? '#1b2838' : colors.border
          }]}>
            <Text style={[styles.title, { color: isDark ? '#c7d5e0' : colors.text }]}>
              {course.title}
            </Text>
            <Text style={[styles.description, { color: isDark ? '#8f98a0' : colors.text }]}>
              {course.description}
            </Text>
            <View style={styles.metadata}>
              <View style={styles.metadataItem}>
                <IconSymbol name="clock" size={16} color={isDark ? '#8f98a0' : colors.text} />
                <Text style={[styles.metadataText, { color: isDark ? '#8f98a0' : colors.text }]}>
                  {course.duration}
                </Text>
              </View>
              <View style={[
                styles.levelBadge,
                {
                  backgroundColor:
                    course.level === 'beginner'
                      ? '#4CAF50'
                      : course.level === 'intermediate'
                      ? '#FFC107'
                      : '#F44336',
                },
              ]}>
                <Text style={styles.levelText}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.sections, { backgroundColor: isDark ? '#1b2838' : colors.background }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#c7d5e0' : colors.text }]}>
              Daftar Materi
            </Text>
            {course.sections.map((section, index) => (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.sectionItem,
                  { 
                    backgroundColor: isDark ? '#2a475e' : colors.card,
                    borderLeftColor: section.type === 'quiz' ? '#FFC107' : colors.primary
                  }
                ]}
                onPress={() => handleSectionPress(section)}
              >
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionInfo}>
                    <View style={[styles.sectionIcon, { backgroundColor: isDark ? '#1b2838' : colors.border + '1A' }]}>
                      <IconSymbol 
                        name={section.type === 'quiz' ? 'questionmark.circle.fill' : 'doc.text'} 
                        size={24} 
                        color={section.type === 'quiz' ? '#FFC107' : colors.primary} 
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.sectionName, { color: isDark ? '#c7d5e0' : colors.text }]}>
                        {section.title}
                      </Text>
                      <Text style={[styles.sectionType, { color: isDark ? '#8f98a0' : colors.text }]}>
                        {section.type === 'quiz' ? 'Kuis' : 'Materi'}
                      </Text>
                    </View>
                  </View>
                  {sectionProgress[section.id] ? (
                    <IconSymbol name="checkmark.circle.fill" size={24} color="#4CAF50" />
                  ) : (
                    <IconSymbol 
                      name="chevron.right" 
                      size={24} 
                      color={section.type === 'quiz' ? '#FFC107' : colors.primary} 
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  completeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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