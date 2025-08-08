# Pasha MobilWebView

React + Capacitor tabanlı mobil uygulama. WebView içinde belirtilen URL'yi açar, QR kod tarama ve push bildirim özelliklerine sahiptir.

## Özellikler

- ✅ WebView içinde web sitesi gösterimi
- ✅ QR kod tarama (@capacitor-mlkit/barcode-scanning)
- ✅ Push bildirimler (Firebase Cloud Messaging)
- ✅ URL yönetimi (sabit değişken veya Remote Config)
- ✅ Android ve iOS desteği

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
cd pasha-mobilwebview
npm install
```

### 2. Firebase Yapılandırması

#### Android için:
1. Firebase Console'dan `google-services.json` dosyasını indirin
2. `android/app/google-services.json` konumuna kopyalayın

#### iOS için:
1. Firebase Console'dan `GoogleService-Info.plist` dosyasını indirin
2. `ios/App/GoogleService-Info.plist` konumuna kopyalayın

### 3. URL Yapılandırması

`src/config.js` dosyasını düzenleyin:

```javascript
export const APP_CONFIG = {
  // Ana WebView URL'i
  webviewUrl: 'https://pasha-frontend.vercel.app/login',
  
  // Firebase yapılandırması
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  },
  
  // Remote Config kullanımı (opsiyonel)
  useRemoteConfig: false
};
```

## Geliştirme

### Web Geliştirme

```bash
npm run dev
```

Tarayıcıda http://localhost:5173 adresinde açılır.

### Build ve Senkronizasyon

```bash
# Web build
npm run build

# Capacitor senkronizasyonu
npx cap sync

# Veya tek komutta
npm run build && npx cap sync
```

## Platform Özel Komutlar

### Android

```bash
# Android Studio'da aç
npx cap open android

# Android emülatörde çalıştır
npx cap run android

# APK oluştur (Android Studio'da)
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

### iOS

```bash
# Xcode'da aç
npx cap open ios

# iOS simülatörde çalıştır
npx cap run ios

# IPA oluştur (Xcode'da)
# Product > Archive
```

## Önemli Dosyalar

```
pasha-mobilwebview/
├── src/
│   ├── App.jsx          # Ana uygulama bileşeni
│   ├── config.js        # URL ve Firebase yapılandırması
│   └── App.css          # Uygulama stilleri
├── android/
│   └── app/
│       ├── google-services.json  # Firebase Android config
│       └── src/main/AndroidManifest.xml  # Android izinler
├── ios/
│   └── App/
│       ├── GoogleService-Info.plist  # Firebase iOS config
│       └── Info.plist    # iOS izinler
└── capacitor.config.ts   # Capacitor yapılandırması
```

## İzinler

### Android (AndroidManifest.xml)
- INTERNET
- CAMERA
- POST_NOTIFICATIONS
- VIBRATE
- WAKE_LOCK

### iOS (Info.plist)
- NSCameraUsageDescription
- UIBackgroundModes (remote-notification)

## Push Bildirim Token'ı

Uygulama açıldığında FCM token'ı konsola yazdırılır:
```
Push bildirim token: [TOKEN_DEGERI]
```

Bu token'ı backend'e göndererek push bildirim gönderebilirsiniz.

## QR Kod Tarama

Üstteki "QR Tara" butonuna tıklayarak kamera açılır. Taranan QR kod:
- URL ise WebView'de açılır
- Değilse içeriği alert ile gösterilir

## Sorun Giderme

### Build Hataları

```bash
# Node modules temizle
rm -rf node_modules
npm install

# Capacitor'ı yeniden senkronize et
npx cap sync
```

### Android Gradle Hataları

```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### iOS Pod Hataları

```bash
cd ios/App
pod install
cd ../..
npx cap sync ios
```

## Deployment Checklist

- [ ] Firebase projeleri oluşturuldu (Android & iOS)
- [ ] google-services.json ve GoogleService-Info.plist eklendi
- [ ] config.js'de Firebase bilgileri güncellendi
- [ ] URL değeri doğru ayarlandı
- [ ] Push bildirim sertifikaları yüklendi (iOS için)
- [ ] App signing yapılandırıldı
- [ ] Build numaraları güncellendi

## Lisans

MIT
