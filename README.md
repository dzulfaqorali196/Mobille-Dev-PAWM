# Virtual Python Lab - Mobile App


## Tim Pengembang

| Nama | NIM |
|------|-----|
| Dzulfaqor Ali D | 18222017 |
| Alvin F | 18222079 |

## Deskripsi
Virtual Python Lab adalah aplikasi pembelajaran Python interaktif yang dibuat menggunakan NativeScript dengan React. Aplikasi ini menyediakan lingkungan belajar yang interaktif untuk mempelajari pemrograman Python.

## Prasyarat
- [Node.js](https://nodejs.org/) (versi 14 atau lebih baru)
- [NativeScript CLI](https://docs.nativescript.org/setup/)
- Android Studio & Android SDK
- Java Development Kit (JDK)

## Setup Development Environment

1. **Install NativeScript CLI**
```bash
npm install -g nativescript
```

2. **Clone Repository**
```bash
git clone <repository-url>
cd Mobille-Dev-PAWM
```

3. **Install Dependencies**
```bash
npm install
```

4. **Setup Android Development**
- Pastikan Android Studio terinstall
- Install Android SDK (minimal API level 21)
- Set ANDROID_HOME environment variable
- Tambahkan platform tools ke PATH

5. **Verifikasi Setup**
```bash
ns doctor android
```

## Menjalankan Aplikasi

1. **Development Mode dengan Hot Reload**
```bash
ns run android
```

2. **Clean Build (jika ada masalah)**
```bash
ns clean
ns run android
```

## Struktur Proyek Penting
- `/src` - Source code aplikasi
- `/App_Resources` - Resource platform-specific
- `nativescript.config.ts` - Konfigurasi NativeScript
- `app.gradle` - Konfigurasi build Android

## Tips Kolaborasi
1. **Sebelum Mulai Coding**
```bash
git pull origin main
npm install
```

2. **Jika Ada Error Gradle**
```bash
ns clean
rm -rf platforms/
ns run android
```

3. **Jika Ada Konflik di platforms/**
- Hapus folder platforms/
- Rebuild dengan `ns run android`

## Troubleshooting Umum

1. **Error: Task 'assembleDebug' not found**
- Hapus folder platforms/
- Jalankan `ns platform add android`
- Jalankan `ns run android`

2. **Error: Resource not found**
- Pastikan semua resource di App_Resources sudah benar
- Clean build dengan `ns clean`

3. **Gradle Build Issues**
- Update Android Studio
- Pastikan SDK Tools terinstall
- Check app.gradle dan build.gradle

## Catatan Penting
- Jangan commit folder platforms/
- Selalu pull sebelum mulai development
- Gunakan branch terpisah untuk fitur baru

## Referensi
- [NativeScript Docs](https://docs.nativescript.org/)
- [React NativeScript](https://react-nativescript.netlify.app/)
- [NativeScript Playground](https://play.nativescript.org/)

# IDE specific
.gradle/
.idea/
*.iml
local.properties

# NativeScript specific
report/
.nsbuildinfo
.nslivesync
.ns-backup/

# Testing
coverage/
test-results/

# OS specific
Thumbs.db
ehthumbs.db
Desktop.ini

# Android specific
.android/
android/
*.keystore
google-services.json

# iOS specific
*.mobileprovision
*.certSigningRequest
*.cer
*.xcuserstate
xcuserdata/

# Temporary files
.history/
.temp/