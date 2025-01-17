<h1 align="center">🐍 Virtual Python Lab</h1>

<p align="center">
  <img src="https://www.python.org/static/community_logos/python-logo-generic.svg" alt="Python Logo" width="300"/>
</p>

<div align="center">
  <strong>Aplikasi Pembelajaran Python Interaktif untuk Pemula</strong>
</div>

<div align="center">
  <sub>Dibuat dengan ❤️ oleh Tim Pengembang Virtual Python Lab</sub>
</div>

<br />

<div align="center">

[![Download APK](https://img.shields.io/badge/Download-APK-green?style=for-the-badge&logo=android)](https://expo.dev/artifacts/eas/8y1KeKL3kG3QoiLFtEaujL.apk)
[![Web Version](https://img.shields.io/badge/Web-Virtual%20Python%20Lab-blue?style=for-the-badge&logo=react)](https://virtual-python-lab.vercel.app)

</div>

## 📱 Download

- Android: [Download APK](https://expo.dev/artifacts/eas/8y1KeKL3kG3QoiLFtEaujL.apk)
- Web: [virtual-python-lab.vercel.app](https://virtual-python-lab.vercel.app)

## 🌐 Versi Web

[![Virtual Python Lab](https://img.shields.io/badge/Web-Virtual%20Python%20Lab-blue?style=for-the-badge&logo=react)](https://virtual-python-lab.vercel.app)

Kunjungi versi web aplikasi di: [virtual-python-lab.vercel.app](https://virtual-python-lab.vercel.app)

## 👨‍💻 Pengembang

| Nama | NIM | Tugas |
|------|-----|-------|
| Dzulfaqor | 18222017 | Full Stack Developer - Pengembangan aplikasi mobile dengan React Native/Expo, integrasi API, dan fitur-fitur utama |
| Alvin Fadhilah | 18222079 | Technical Writer - Pembuatan dokumentasi lengkap, presentasi PPT/PDF, video demo aplikasi, dan materi pembelajaran |

## 📝 Deskripsi Proyek

Virtual Python Lab adalah aplikasi pembelajaran Python interaktif yang dirancang khusus untuk pemula. Aplikasi ini menyediakan lingkungan belajar yang komprehensif dengan materi pembelajaran terstruktur, kuis interaktif, dan simulator kode Python.

## 🎯 Fitur Utama

- ✨ Materi pembelajaran terstruktur dan mudah dipahami
- 📝 Kuis interaktif untuk menguji pemahaman
- 💻 Simulator kode Python langsung di aplikasi
- 📝 Template kode untuk pembelajaran
- 🌙 Mode gelap/terang untuk kenyamanan pengguna
- 🔄 Sinkronisasi data dengan Supabase
- 🌐 Tersedia versi web dan mobile

## 🛠️ Teknologi yang Digunakan

- React Native / Expo
- TypeScript
- Supabase (Backend & Database)
- React Navigation
- Markdown Renderer
- Judge0 API (Code Execution)
- Expo Secure Store
- React Navigation

## 📦 Cara Instalasi

1. Clone repositori ini:\`\`\`bash
git clone https://github.com/yourusername/VirtualPythonLab.git
\`\`\`

2. Masuk ke direktori proyek:
\`\`\`bash
cd VirtualPythonLab
\`\`\`

3. Install dependensi:
\`\`\`bash
npm install
# atau
yarn install
\`\`\`

4. Salin file .env.example menjadi .env dan atur variabel environment:
\`\`\`bash
cp .env.example .env
\`\`\`

5. Jalankan aplikasi:
\`\`\`bash
npx expo start
\`\`\`

## 📱 Cara Penggunaan

1. **Registrasi/Login**
   - Buat akun baru atau login dengan akun yang sudah ada
   - Isi profil pengguna

2. **Memulai Pembelajaran**
   - Pilih modul pembelajaran yang tersedia
   - Ikuti materi pembelajaran secara berurutan
   - Selesaikan kuis di setiap akhir modul

3. **Praktik Koding**
   - Gunakan simulator kode Python
   - Coba contoh kode yang tersedia
   - Eksperimen dengan kode sendiri

4. **Tracking Progress**
   - Pantau progress pembelajaran
   - Lihat nilai kuis
   - Review materi yang sudah dipelajari

## 📚 Struktur Materi

1. **Pengenalan Python**
   - Pengenalan bahasa Python
   - Instalasi dan setup
   - Hello World program

2. **Variabel dan Tipe Data**
   - Pengenalan variabel
   - Tipe data dasar
   - Operasi dasar

3. **Struktur Data**
   - List dan Tuple
   - Dictionary
   - Set

## 📱 Build APK

1. **Persiapan Build**:
   ```bash
   # Install EAS CLI
   npm install -g eas-cli

   # Login ke Expo
   eas login

   # Konfigurasi build
   eas build:configure
   ```

2. **Update app.json**:
   ```json
   {
     "expo": {
       "android": {
         "package": "com.virtualpythonlab.app",
         "versionCode": 1
       }
     }
   }
   ```

3. **Pastikan Environment Variables**:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_JUDGE0_API=https://judge0-ce.p.rapidapi.com
   EXPO_PUBLIC_JUDGE0_KEY=your_judge0_api_key
   ```

4. **Build APK**:
   ```bash
   # Build APK untuk development
   eas build -p android --profile preview

   # Build APK untuk production
   eas build -p android --profile production
   ```

5. **Download dan Distribusi**:
   - APK akan tersedia di Expo Dashboard
   - Atau gunakan perintah: `eas download`

### ⚠️ Catatan Penting

1. **Code Execution**:
   - Menggunakan Judge0 API
   - Support bahasa Python
   - Batasan eksekusi kode yang aman

2. **Security**:
   - Autentikasi dengan Supabase
   - Gunakan environment variables yang aman
   - Pastikan konfigurasi keamanan Expo

3. **Monitoring**:
   - Pantau penggunaan Judge0 API
   - Monitor autentikasi Supabase
   - Perhatikan batasan layanan gratis

## 🤝 Kontribusi

Kami sangat menghargai kontribusi dari komunitas. Untuk berkontribusi:

1. Fork repositori ini
2. Buat branch fitur baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📞 Kontak

Untuk pertanyaan dan saran, silakan hubungi tim pengembang:
- Email: [dzulfaqor@gmail.com](mailto:dzulfaqor@gmail.com)
- Email: [alvinfadhillah@gmail.com](mailto:alvinfadhillah@gmail.com)

## 🙏 Ucapan Terima Kasih

Terima kasih kepada semua yang telah berkontribusi dalam pengembangan Virtual Python Lab, termasuk dosen pembimbing dan teman-teman yang telah memberikan masukan berharga.