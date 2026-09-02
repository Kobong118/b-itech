'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const initPushNotifications = async () => {
      // Pastikan hanya berjalan di platform Android/iOS Native (bukan browser web biasa)
      if (!Capacitor.isNativePlatform()) {
        console.log('Bukan platform native, lewati registrasi Push Notification');
        return;
      }

      try {
        // 1. Buat Android Notification Channel dengan tingkat urgensi HIGH (5)
        // Ini memastikan notifikasi tetap tampil di status bar & sebagai banner saat app terbuka
        await PushNotifications.createChannel({
          id: 'default',
          name: 'Notifikasi Utama',
          description: 'Channel untuk notifikasi umum B ITech ADM',
          importance: 5, // 5 = HIGH/CRITICAL (Pop-up banner + Suara/Getar)
          visibility: 1, // Public notification
          vibration: true,
        });

        // 2. Minta izin notifikasi ke pengguna
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt' || permStatus.receive === 'prompt-with-rationale') {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive === 'granted') {
          // 3. Registrasi perangkat ke FCM
          await PushNotifications.register();
        } else {
          console.warn('Izin notifikasi ditolak oleh pengguna');
        }

        // 4. Dapatkan Token FCM (Akan kita simpan ke Supabase di tahap berikutnya)
        await PushNotifications.addListener('registration', (token) => {
          console.log('>>> FCM Token Kamu:', token.value);
          // TODO: Simpan token.value ke tabel user_fcm_tokens di Supabase
        });

        await PushNotifications.addListener('registrationError', (err) => {
          console.error('Gagal mendaftarkan FCM:', err.error);
        });

        // 5. Handle ketika notifikasi diterima saat app SEDANG TERBUKA (Foreground)
        await PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Notifikasi diterima saat app terbuka:', notification);
        });

        // 6. Handle KLIK NOTIFIKASI -> Pindah ke Halaman Spesifik
        await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('Notifikasi diklik:', action);
          
          // Mengambil data custom URL payload dari FCM (contoh payload: { "url": "/mobile/orders/123" })
          const targetUrl = action.notification.data?.url;
          
          if (targetUrl) {
            console.log('Mengarahkan ke halaman:', targetUrl);
            router.push(targetUrl); // Menggunakan Next.js Router untuk navigasi seamless
          }
        });

      } catch (error) {
        console.error('Error pada Push Notification setup:', error);
      }
    };

    initPushNotifications();

    // Cleanup listeners saat komponen unmount
    return () => {
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
      }
    };
  }, [router]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Mobile Page</h1>
      <p className="text-gray-600">Aplikasi B ITech ADM siap menerima notifikasi.</p>
    </div>
  );
}