import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal, View } from 'react-native';
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
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState('');

  useEffect(() => {
    if (user) {
      loadProgress();
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      // Cek apakah profile sudah ada
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('user_id', user?.id);

      if (fetchError) throw fetchError;

      if (existingProfile && existingProfile.length > 0) {
        setNickname(existingProfile[0].nickname);
      } else {
        // Buat profile baru jika belum ada
        const username = user?.email?.split('@')[0] || '';
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ user_id: user?.id, nickname: username });

        if (insertError) throw insertError;
        setNickname(username);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadProgress = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user?.id);

      if (courseError) throw courseError;
      setCourseProgress(courseData || []);

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

  const handleUpdateNickname = async () => {
    if (!tempNickname.trim()) {
      Alert.alert('Error', 'Nickname tidak boleh kosong');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nickname: tempNickname.trim() })
        .eq('user_id', user?.id);

      if (error) throw error;

      setNickname(tempNickname.trim());
      setIsEditingNickname(false);
      Alert.alert('Sukses', 'Nickname berhasil diperbarui');
    } catch (error) {
      console.error('Error updating nickname:', error);
      Alert.alert('Error', 'Gagal memperbarui nickname');
    }
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
        <ThemedView style={styles.profileSection}>
          <IconSymbol name="person.circle.fill" size={100} color="#66c0f4" />
          
          <TouchableOpacity 
            style={styles.nicknameContainer}
            onPress={() => {
              setTempNickname(nickname);
              setIsEditingNickname(true);
            }}
          >
            <ThemedText style={styles.nickname}>{nickname}</ThemedText>
            <ThemedText style={styles.editHint}>(Ketuk untuk mengubah)</ThemedText>
          </TouchableOpacity>
          
          <ThemedText style={styles.email}>{user?.email}</ThemedText>
          
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <ThemedText style={styles.signOutText}>Keluar</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Modal Edit Nickname */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isEditingNickname}
          onRequestClose={() => setIsEditingNickname(false)}
        >
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent}>
              <ThemedText style={styles.modalTitle}>Ubah Nickname</ThemedText>
              <TextInput
                style={styles.nicknameInput}
                value={tempNickname}
                onChangeText={setTempNickname}
                placeholder="Masukkan nickname baru"
                placeholderTextColor="#666"
                autoFocus={true}
                maxLength={20}
                selectionColor="#66c0f4"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsEditingNickname(false)}
                >
                  <ThemedText style={styles.modalButtonText}>Batal</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleUpdateNickname}
                >
                  <ThemedText style={styles.modalButtonText}>Simpan</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          </View>
        </Modal>

        <ThemedView style={styles.statsSection}>
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statsCard}>
              <ThemedText style={styles.statsNumber}>{courseProgress.length}</ThemedText>
              <ThemedText style={styles.statsLabel}>Kursus{'\n'}Dimulai</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsCard}>
              <ThemedText style={styles.statsNumber}>
                {courseProgress.filter(p => p.is_completed).length}
              </ThemedText>
              <ThemedText style={styles.statsLabel}>Kursus{'\n'}Selesai</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsCard}>
              <ThemedText style={styles.statsNumber}>
                {sectionProgress.filter(p => p.is_completed).length}
              </ThemedText>
              <ThemedText style={styles.statsLabel}>Materi{'\n'}Selesai</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.progressSection}>
          {COURSES.map(course => {
            const completedSections = getCompletedSections(course.code);
            const totalSections = getTotalSections(course.code);
            const percentage = Math.round((completedSections / totalSections) * 100) || 0;

            return (
              <TouchableOpacity
                key={course.code}
                style={styles.courseCard}
                onPress={() => router.push(`/learn/${course.code}`)}
              >
                <ThemedText style={styles.courseTitle}>{course.title}</ThemedText>
                <ThemedText style={styles.courseProgress}>
                  {completedSections} dari {totalSections} materi selesai
                </ThemedText>
                <ThemedView style={styles.progressBarWrapper}>
                  <ThemedView style={styles.progressBar}>
                    <ThemedView 
                      style={[
                        styles.progressFill,
                        { width: `${percentage}%` },
                        percentage === 100 && styles.progressComplete,
                      ]} 
                    />
                  </ThemedView>
                  <ThemedText style={[
                    styles.percentageText,
                    percentage === 100 && styles.progressTextComplete
                  ]}>
                    {percentage}%
                  </ThemedText>
                </ThemedView>
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
    backgroundColor: '#121212',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  profileSection: {
    backgroundColor: '#121212',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  nicknameContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  editHint: {
    color: '#66c0f4',
    fontSize: 14,
    opacity: 0.8,
  },
  email: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  signOutButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#66c0f4',
    marginBottom: 8,
    textAlign: 'center',
  },
  statsLabel: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  progressSection: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  courseProgress: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#66c0f4',
    borderRadius: 4,
  },
  progressComplete: {
    backgroundColor: '#4CAF50',
  },
  progressTextComplete: {
    color: '#4CAF50',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#66c0f4',
    width: 45,
  },
  message: {
    fontSize: 17,
    marginBottom: 24,
    textAlign: 'center',
    color: '#fff',
  },
  button: {
    backgroundColor: '#66c0f4',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  nicknameInput: {
    backgroundColor: '#2A2A2A',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2A2A2A',
  },
  saveButton: {
    backgroundColor: '#66c0f4',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 