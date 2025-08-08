import { useEffect, useState, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { APP_CONFIG } from './config';
import './App.css';

function App() {
  const [currentUrl, setCurrentUrl] = useState(APP_CONFIG.webviewUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [pushToken, setPushToken] = useState('');
  const webviewRef = useRef(null);

  useEffect(() => {
    // Push bildirimleri başlat
    if (Capacitor.isNativePlatform()) {
      initPushNotifications();
      requestPermissions();
    }
  }, []);

  // İzinleri iste
  const requestPermissions = async () => {
    try {
      // Kamera izni
      const { camera } = await BarcodeScanner.requestPermissions();
      console.log('Kamera izni:', camera);
    } catch (error) {
      console.error('İzin hatası:', error);
    }
  };

  // Push bildirimleri başlat
  const initPushNotifications = async () => {
    try {
      // Push bildirim izinleri
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.log('Push bildirim izni reddedildi');
        return;
      }

      // Push bildirimleri kaydet
      await PushNotifications.register();

      // Token dinleyici
      PushNotifications.addListener('registration', (token) => {
        console.log('Push bildirim token:', token.value);
        setPushToken(token.value);
      });

      // Hata dinleyici
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push bildirim kayıt hatası:', error);
      });

      // Bildirim alındığında (uygulama açıkken)
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Bildirim alındı:', notification);
        alert(`Bildirim: ${notification.title}\n${notification.body}`);
      });

      // Bildirime tıklandığında
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Bildirime tıklandı:', notification);
        // Bildirimdeki link varsa WebView'de aç
        if (notification.notification.data?.url) {
          setCurrentUrl(notification.notification.data.url);
        }
      });
    } catch (error) {
      console.error('Push bildirim başlatma hatası:', error);
    }
  };

  // QR kod tarama
  const scanQRCode = async () => {
    try {
      // Kamera izni kontrol et
      const { camera } = await BarcodeScanner.checkPermissions();
      
      if (camera !== 'granted') {
        const { camera: newPermission } = await BarcodeScanner.requestPermissions();
        if (newPermission !== 'granted') {
          alert('Kamera izni gerekli!');
          return;
        }
      }

      setIsScanning(true);

      // Taramayı başlat
      const { barcodes } = await BarcodeScanner.scan({
        formats: [BarcodeScanner.BarcodeFormat.QrCode],
      });

      setIsScanning(false);

      if (barcodes.length > 0) {
        const qrData = barcodes[0].rawValue;
        console.log('QR kod okundu:', qrData);
        
        // URL ise WebView'de aç
        if (qrData.startsWith('http://') || qrData.startsWith('https://')) {
          setCurrentUrl(qrData);
        } else {
          alert(`QR İçeriği: ${qrData}`);
        }
      }
    } catch (error) {
      console.error('QR tarama hatası:', error);
      setIsScanning(false);
      alert('QR kod tarama hatası!');
    }
  };

  // Web mesajları dinle (WebView'den gelen)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== new URL(currentUrl).origin) return;
      
      console.log('WebView mesajı:', event.data);
      // WebView'den gelen mesajları işle
      if (event.data.type === 'requestToken') {
        // WebView'e push token gönder
        webviewRef.current?.contentWindow?.postMessage({
          type: 'pushToken',
          token: pushToken
        }, '*');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentUrl, pushToken]);

  return (
    <div className="app-container">
      <div className="webview-container">
        <iframe
          ref={webviewRef}
          src={currentUrl}
          className="webview"
          title="Pasha WebView"
          allow="camera; microphone; geolocation"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
        />
      </div>

      {/* Debug bilgileri (production'da kaldırılmalı) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <small>
            URL: {currentUrl}<br/>
            Token: {pushToken ? `${pushToken.substring(0, 20)}...` : 'Bekleniyor'}
          </small>
        </div>
      )}
    </div>
  );
}

export default App
