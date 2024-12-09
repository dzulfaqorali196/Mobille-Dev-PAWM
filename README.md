# Virton - Python Learning App

## Persyaratan Sistem

- Node.js (versi 16 atau lebih baru)
- npm atau yarn
- Android Studio & Android SDK
- Expo CLI
- EAS CLI
- Git

## Langkah Instalasi

1. **Clone Repository**
```bash
git clone https://github.com/username/virton.git
cd virton
```

2. **Install Dependencies**
```bash
npm install
```

3. **Install Expo CLI & EAS CLI**
```bash
npm install -g expo-cli
npm install -g eas-cli
```

4. **Setup Android Studio**
- Install Android Studio
- Install Android SDK (minimum API level 21)
- Buat Android Virtual Device (AVD)
- Set ANDROID_HOME environment variable

## Menjalankan Aplikasi (Development)

1. **Development Mode**
```bash
npx expo start
```

2. **Opsi Menjalankan:**
- Tekan `a` - untuk membuka di Android Emulator
- Tekan `i` - untuk membuka di iOS Simulator (macOS only)
- Scan QR Code dengan Expo Go untuk perangkat fisik

## Build APK

1. **Login ke Expo**
```bash
eas login
```

2. **Konfigurasi EAS Build**
- Pastikan file `eas.json` sudah ada dengan konfigurasi:
```json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

3. **Build APK Preview**
```bash
eas build -p android --profile preview
```

4. **Build APK Production**
```bash
eas build -p android --profile production
```

## Troubleshooting

1. **Jika terjadi error saat build:**
```bash
expo start --clear
```

2. **Untuk reset cache:**
```bash
npm start -- --reset-cache
```

3. **Jika ada masalah dengan dependencies:**
```bash
rd /s /q node_modules
npm install
```

## Struktur Project

```
virton/
├── app/                # Router dan screens
│   ├── (tabs)/        # Tab screens
│   ├── screens/       # Other screens
│   └── _layout.tsx    # Root layout
├── assets/            # Gambar, fonts, dll
├── components/        # Reusable components
└── hooks/             # Custom hooks
```

## Fitur Utama

- Interactive Learning Path
- Live Code Editor
- Progress Tracking
- Dark/Light Mode Support

## Catatan Penting

- Pastikan semua environment variables sudah diset dengan benar
- Untuk development, gunakan Expo Go
- Untuk testing build APK, gunakan profile "preview"
- Untuk production release, gunakan profile "production"
- Backup project sebelum melakukan build atau perubahan besar

## Kontak & Support

- GitHub Issues: [https://github.com/username/virton/issues](https://github.com/username/virton/issues)
- Email: support@virton.com
```