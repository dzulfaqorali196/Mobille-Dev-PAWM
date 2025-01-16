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
import { useFocusEffect } from '@react-navigation/native';

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

      // Refresh data setiap 2 detik
      const interval = setInterval(() => {
        loadProgress();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [user]);

  // Gunakan useFocusEffect untuk refresh saat tab aktif
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadProgress();
      }
    }, [user])
  );

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

          {courseProgress.map(progress => {
            const course = COURSES.find(c => c.code === progress.course_code);
            if (!course) return null;

            return (
              <ThemedView key={progress.course_code} style={styles.courseProgress}>
                <ThemedText style={styles.courseTitle}>{course.title}</ThemedText>
                <ThemedText style={styles.progressInfo}>
                  {progress.progress_percentage}% selesai
                </ThemedText>
                <ThemedView style={styles.progressBar}>
                  <ThemedView 
                    style={[
                      styles.progressFill,
                      { width: `${progress.progress_percentage}%` }
                    ]} 
                  />
                </ThemedView>
              </ThemedView>
            );
          })}
        </ThemedView>
      </ScrollView>

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
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 17,
    marginBottom: 24,
    textAlign: 'center',
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
  profileSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  nicknameContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  editHint: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.8,
    marginTop: 5,
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsSection: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  statsCard: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 25,
    paddingBottom: 25,
    margin: 5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#66c0f4',
    marginBottom: 15,
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 40,
  },
  statsLabel: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
    includeFontPadding: false,
    paddingHorizontal: 5,
  },
  courseProgress: {
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressInfo: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#66c0f4',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
  },
  nicknameInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveButton: {
    backgroundColor: '#66c0f4',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 