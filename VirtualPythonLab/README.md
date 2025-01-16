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

## 👨‍💻 Pengembang

| Nama | NIM |
|------|-----|
| Dzulfaqor | 18222017 |
| Alvin Fadhilah | 18222079 |

## 📝 Deskripsi Proyek

Virtual Python Lab adalah aplikasi pembelajaran Python interaktif yang dirancang khusus untuk pemula. Aplikasi ini menyediakan lingkungan belajar yang komprehensif dengan materi pembelajaran terstruktur, kuis interaktif, dan simulator kode Python.

## 🎯 Fitur Utama

- ✨ Materi pembelajaran terstruktur dan mudah dipahami
- 📝 Kuis interaktif untuk menguji pemahaman
- 💻 Simulator kode Python langsung di aplikasi
- 🌙 Mode gelap/terang untuk kenyamanan pengguna
- 📊 Sistem tracking progress pembelajaran
- 🔄 Sinkronisasi data pembelajaran

## 🛠️ Teknologi yang Digunakan

- React Native / Expo
- TypeScript
- Supabase (Backend & Database)
- React Navigation
- Markdown Renderer
- Python Code Executor
- FastAPI WebSocket Server

## 📦 Cara Instalasi

1. Clone repositori ini:
\`\`\`bash
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

## 📦 Build dan Deployment

### 🚀 Deploy Backend

1. **Deploy ke Railway.app** (Rekomendasi karena gratis dan mudah):
   \`\`\`bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login ke Railway
   railway login

   # Inisialisasi proyek
   cd backend
   railway init

   # Deploy
   railway up
   \`\`\`

2. **Atau Deploy ke Heroku**:
   \`\`\`bash
   # Install Heroku CLI
   npm install -g heroku

   # Login ke Heroku
   heroku login

   # Buat aplikasi baru
   heroku create virtual-python-lab-backend

   # Deploy
   git subtree push --prefix backend heroku main
   \`\`\`

3. **Setup Environment Variables**:
   - `WEBSOCKET_URL`: URL websocket server
   - `PYTHON_PATH`: Path ke Python interpreter
   - `COMPILER_TIMEOUT`: Timeout untuk kompilasi (dalam detik)

### 📱 Build APK

1. **Persiapan Build**:
   \`\`\`bash
   # Install EAS CLI
   npm install -g eas-cli

   # Login ke Expo
   eas login

   # Konfigurasi build
   eas build:configure
   \`\`\`

2. **Update app.json**:
   \`\`\`json
   {
     "expo": {
       "android": {
         "package": "com.virtualpythonlab.app",
         "versionCode": 1
       }
     }
   }
   \`\`\`

3. **Update .env untuk Production**:
   \`\`\`
   BACKEND_URL=https://your-backend-url.railway.app
   WEBSOCKET_URL=wss://your-backend-url.railway.app/ws
   \`\`\`

4. **Build APK**:
   \`\`\`bash
   # Build APK untuk development
   eas build -p android --profile preview

   # Build APK untuk production
   eas build -p android --profile production
   \`\`\`

5. **Download dan Distribusi**:
   - APK akan tersedia di Expo Dashboard
   - Atau gunakan perintah: `eas download`

### ⚠️ Catatan Penting

1. **Backend Requirements**:
   - Python 3.8+
   - FastAPI
   - Websockets
   - uvicorn

2. **Security**:
   - Gunakan HTTPS untuk production
   - Batasi akses CORS
   - Implementasi rate limiting
   - Gunakan environment variables

3. **Monitoring**:
   - Setup logging
   - Gunakan error tracking
   - Monitor penggunaan resources

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
- Email: [alvinfadhilah@gmail.com](mailto:alvinfadhilah@gmail.com)

## 🙏 Ucapan Terima Kasih

Terima kasih kepada semua yang telah berkontribusi dalam pengembangan Virtual Python Lab, termasuk dosen pembimbing dan teman-teman yang telah memberikan masukan berharga. 