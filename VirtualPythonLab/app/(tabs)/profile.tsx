import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal, View, Text } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { COURSES } from '../../constants/courses';
import { CourseProgress, SectionProgress } from '../../types/course';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../lib/ThemeContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { isDark, toggleTheme, colors } = useTheme();

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
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('nickname, avatar_url')
        .eq('user_id', user?.id)
        .single();

      if (fetchError) throw fetchError;

      if (existingProfile) {
        setNickname(existingProfile.nickname);
        setProfileImage(existingProfile.avatar_url);
      } else {
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

  const uploadImage = async (uri: string): Promise<string> => {
    try {
      console.log('Mulai upload gambar...');
      console.log('URI:', uri);
      
      // Dapatkan ekstensi file dengan cara yang lebih aman
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      
      // Validasi tipe file
      if (!['jpg', 'jpeg', 'png'].includes(fileExt)) {
        throw new Error('Format file tidak didukung (gunakan JPG atau PNG)');
      }

      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      console.log('Nama file:', fileName);

      // Konversi gambar ke base64 dengan timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30 detik timeout

      try {
        const response = await fetch(uri, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        clearTimeout(timeout);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        console.log('Blob size:', blob.size);
        
        if (blob.size > 5 * 1024 * 1024) { // 5MB
          throw new Error('Ukuran file terlalu besar (maksimal 5MB)');
        }
      
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              if (!reader.result || typeof reader.result !== 'string') {
                throw new Error('Gagal membaca file sebagai base64');
              }

              const base64String = reader.result;
              const base64Data = base64String.split(',')[1]; // Ambil data setelah prefix
              
              if (!base64Data) {
                throw new Error('Data base64 tidak valid');
              }
              
              console.log('Ukuran base64:', base64Data.length);
              
              // Upload ke Supabase Storage
              const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, decode(base64Data), {
                  contentType: `image/${fileExt}`,
                  upsert: true
                });

              if (uploadError) {
                console.error('Error upload ke storage:', uploadError);
                reject(new Error(uploadError.message));
                return;
              }

              console.log('Upload berhasil:', data);

              // Dapatkan public URL
              const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

              console.log('Public URL:', publicUrl);

              // Update profile dengan avatar_url baru
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('user_id', user?.id);

              if (updateError) {
                console.error('Error update profile:', updateError);
                reject(new Error(updateError.message));
                return;
              }

              console.log('Profile berhasil diupdate');
              resolve(publicUrl);
            } catch (error) {
              console.error('Error dalam onload:', error);
              reject(error);
            }
          };
          
          reader.onerror = () => {
            console.error('Error membaca file');
            reject(new Error('Gagal membaca file'));
          };
          
          reader.readAsDataURL(blob);
        });
      } catch (fetchError: any) {
        clearTimeout(timeout);
        if (fetchError.name === 'AbortError') {
          throw new Error('Waktu request terlalu lama, silakan coba lagi');
        }
        throw fetchError;
      }
    } catch (error: any) {
      console.error('Error detail lengkap:', error);
      if (error.message.includes('Network request failed')) {
        throw new Error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
      }
      throw new Error(error.message || 'Gagal mengupload gambar');
    }
  };

  // Fungsi untuk decode base64
  function decode(base64: string) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const lookup = new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
      lookup[chars.charCodeAt(i)] = i;
    }
    
    const bytes = new Uint8Array(Math.floor((base64.length * 3) / 4));
    let a, b, c, d;
    let p = 0;
    
    for (let i = 0; i < base64.length; i += 4) {
      a = lookup[base64.charCodeAt(i)];
      b = lookup[base64.charCodeAt(i + 1)];
      c = lookup[base64.charCodeAt(i + 2)];
      d = lookup[base64.charCodeAt(i + 3)];
      
      bytes[p++] = (a << 2) | (b >> 4);
      bytes[p++] = ((b & 15) << 4) | (c >> 2);
      bytes[p++] = ((c & 3) << 6) | (d & 63);
    }
    
    return bytes;
  }

  const pickImage = async (type: 'camera' | 'gallery') => {
    try {
      let result;

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1] as [number, number],
        quality: 0.3,
        base64: false,
        exif: false
      };

      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Izin Ditolak', 'Maaf, kami membutuhkan izin kamera untuk fitur ini!');
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Izin Ditolak', 'Maaf, kami membutuhkan izin galeri untuk fitur ini!');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets[0]) {
        setModalVisible(false);
        
        // Tampilkan loading dengan ActivityIndicator
        Alert.alert(
          'Mengupload',
          'Mohon tunggu sebentar...',
          [],
          { cancelable: false }
        );
        
        try {
          const publicUrl = await uploadImage(result.assets[0].uri);
          setProfileImage(publicUrl);
          Alert.alert('Sukses', 'Foto profil berhasil diperbarui');
        } catch (error: any) {
          console.error('Error upload:', error);
          Alert.alert(
            'Gagal',
            'Tidak dapat mengupload foto. ' + (error.message || 'Silakan coba lagi.')
          );
        }
      }
    } catch (error: any) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'Gagal mengambil foto. ' + (error.message || 'Silakan coba lagi.')
      );
    }
  };

  const removeProfileImage = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', user?.id);

      if (error) throw error;

      setProfileImage(null);
      setModalVisible(false);
      Alert.alert('Sukses', 'Foto profil berhasil dihapus');
    } catch (error) {
      console.error('Error removing profile image:', error);
      Alert.alert('Error', 'Gagal menghapus foto profil');
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
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.profileSection, { 
          backgroundColor: colors.card,
          borderBottomColor: colors.border 
        }]}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.profileImage}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.image}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.defaultProfileImage}>
                  <IconSymbol name="person.circle.fill" size={80} color="#999" />
                  <ThemedText style={styles.changePhotoText}>Ubah Foto</ThemedText>
                </View>
              )}
            </View>
            <View style={styles.editBadge}>
              <ThemedText style={styles.editBadgeText}>Edit</ThemedText>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.nicknameContainer}
            onPress={() => {
              setTempNickname(nickname);
              setIsEditingNickname(true);
            }}
          >
            <ThemedText style={[styles.nickname, { color: isDark ? '#c7d5e0' : '#000000' }]}>{nickname}</ThemedText>
            <ThemedText style={[styles.editHint, { color: isDark ? '#66c0f4' : colors.primary }]}>(Ketuk untuk mengubah)</ThemedText>
          </TouchableOpacity>
          
          <ThemedText style={[styles.email, { color: isDark ? '#c7d5e0' : '#000000' }]}>{user?.email}</ThemedText>
          
          <TouchableOpacity 
            style={[styles.themeToggle, { 
              backgroundColor: isDark ? '#161b22' : colors.card,
              borderColor: isDark ? '#30363d' : colors.border,
            }]} 
            onPress={toggleTheme}
          >
            <IconSymbol 
              name={isDark ? "moon.fill" : "sun.max.fill"} 
              size={24} 
              color={isDark ? '#58a6ff' : colors.primary} 
            />
            <ThemedText style={[styles.themeToggleText, { color: isDark ? '#c9d1d9' : colors.text }]}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <ThemedText style={styles.signOutText}>Keluar</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={[styles.statsSection, { backgroundColor: colors.background }]}>
          <View style={styles.statsContainer}>
            <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statsNumber, { color: colors.primary }]}>
                {courseProgress.length}
              </Text>
              <Text style={[styles.statsLabel, { color: colors.text }]}>
                Kursus{'\n'}Dimulai
              </Text>
            </View>
            <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statsNumber, { color: colors.primary }]}>
                {courseProgress.filter(p => p.is_completed).length}
              </Text>
              <Text style={[styles.statsLabel, { color: colors.text }]}>
                Kursus{'\n'}Selesai
              </Text>
            </View>
            <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statsNumber, { color: colors.primary }]}>
                {sectionProgress.filter(p => p.is_completed).length}
              </Text>
              <Text style={[styles.statsLabel, { color: colors.text }]}>
                Materi{'\n'}Selesai
              </Text>
            </View>
          </View>

          {courseProgress.map(progress => {
            const course = COURSES.find(c => c.code === progress.course_code);
            if (!course) return null;

            return (
              <View key={progress.course_code} 
                style={[styles.courseProgress, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.courseTitle, { color: colors.text }]}>
                  {course.title}
                </Text>
                <Text style={[styles.progressInfo, { color: colors.primary }]}>
                  {progress.progress_percentage}% selesai
                </Text>
                <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${progress.progress_percentage}%`,
                        backgroundColor: colors.primary 
                      }
                    ]} 
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal Edit Nickname */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isEditingNickname}
        onRequestClose={() => setIsEditingNickname(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Ubah Nickname
            </Text>
            <TextInput
              style={[styles.nicknameInput, { 
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text
              }]}
              value={tempNickname}
              onChangeText={setTempNickname}
              placeholder="Masukkan nickname baru"
              placeholderTextColor={colors.text + '80'}
              autoFocus={true}
              maxLength={20}
              selectionColor={colors.primary}
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
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Foto profil</ThemedText>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => pickImage('camera')}
            >
              <IconSymbol name="camera" size={24} color="#4CAF50" />
              <ThemedText style={styles.modalOptionText}>Kamera</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => pickImage('gallery')}
            >
              <IconSymbol name="photo" size={24} color="#4CAF50" />
              <ThemedText style={styles.modalOptionText}>Galeri</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={removeProfileImage}
            >
              <IconSymbol name="person.crop.circle" size={24} color="#4CAF50" />
              <ThemedText style={styles.modalOptionText}>Hapus Foto</ThemedText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
    borderBottomColor: '#2a475e',
    backgroundColor: '#1b2838',
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
    marginTop: 4,
  },
  email: {
    fontSize: 16,
    marginTop: 5,
  },
  signOutButton: {
    backgroundColor: '#c23d3d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsSection: {
    padding: 20,
    backgroundColor: '#171a21',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsCard: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a475e',
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
    color: '#c7d5e0',
    lineHeight: 18,
    includeFontPadding: false,
    paddingHorizontal: 5,
  },
  courseProgress: {
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#2a475e',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#c7d5e0',
  },
  progressInfo: {
    fontSize: 14,
    color: '#66c0f4',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#171a21',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#66c0f4',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1b2838',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#c7d5e0',
  },
  nicknameInput: {
    borderWidth: 1,
    borderColor: '#2a475e',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#c7d5e0',
    backgroundColor: '#2a475e',
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
    backgroundColor: '#2a475e',
  },
  saveButton: {
    backgroundColor: '#66c0f4',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c7d5e0',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    position: 'relative',
    width: 120,
    height: 120,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#2a475e',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  defaultProfileImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a475e',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  changePhotoText: {
    position: 'absolute',
    bottom: '25%',
    fontSize: 12,
    color: '#c7d5e0',
    textAlign: 'center',
  },
  editBadge: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    backgroundColor: '#66c0f4',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    zIndex: 1,
  },
  editBadgeText: {
    color: '#171a21',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cameraIconContainer: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: '#4CAF50',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#2a475e',
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#c7d5e0',
  },
  innerCameraIcon: {
    position: 'absolute',
    bottom: '20%',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  themeToggleText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 