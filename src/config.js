// URL Konfigürasyonu
// Bu değeri değiştirerek uygulamanın açacağı URL'yi güncelleyebilirsiniz
// İlerleyen aşamalarda Firebase Remote Config ile dinamik hale getirilebilir

export const APP_CONFIG = {
  // Ana WebView URL'i
  webviewUrl: 'https://pasha-frontend.vercel.app/',
  
  // Firebase yapılandırması (FCM için gerekli olacak)
  firebase: {
    apiKey: "AIzaSyCy6R8gaBwZHqcckD-gxm0cy4OO1dDQpv4",
    authDomain: "pashamobilapp.firebaseapp.com",
    projectId: "pashamobilapp",
    storageBucket: "pashamobilapp.firebasestorage.app",
    messagingSenderId: "153335450192",
    appId: "1:153335450192:android:6b9ffc3838e192c4005f55"
  },
  
  // Remote Config kullanılacak mı?
  useRemoteConfig: false // true yapıldığında Firebase Remote Config'den URL alınacak
};