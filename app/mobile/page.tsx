'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { PowerIcon } from '@heroicons/react/24/outline';
import { handleSignOut } from '@/app/lib/aksi';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const initPushNotifications = async () => {
      // Pastikan hanya berjalan di platform Android/iOS Native
      if (!Capacitor.isNativePlatform()) {
        console.log('Bukan platform native, lewati registrasi Push Notification');
        return;
      }

      try {
        // 1. Buat Android Notification Channel
        await PushNotifications.createChannel({
          id: 'default',
          name: 'Notifikasi Utama',
          description: 'Channel untuk notifikasi umum B ITech ADM',
          importance: 5,
          visibility: 1,
          vibration: true,
        });

        // 2. Minta izin notifikasi
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

        // 4. Dapatkan Token FCM
        await PushNotifications.addListener('registration', (token) => {
          console.log('>>> FCM Token Kamu:', token.value);
        });

        await PushNotifications.addListener('registrationError', (err) => {
          console.error('Gagal mendaftarkan FCM:', err.error);
        });

        // 5. Listener saat app terbuka (Foreground)
        await PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Notifikasi diterima saat app terbuka:', notification);
        });

        // 6. Listener saat notifikasi diklik
        await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('Notifikasi diklik:', action);
          const targetUrl = action.notification.data?.url;

          if (targetUrl) {
            console.log('Mengarahkan ke halaman:', targetUrl);
            router.push(targetUrl);
          }
        });
      } catch (error) {
        console.error('Error pada Push Notification setup:', error);
      }
    };

    initPushNotifications();

    // Cleanup listeners
    return () => {
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
      }
    };
  }, [router]);

  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-4 p-4 bg-slate-50">
      <h1 className="text-2xl font-bold text-slate-800">Mobile Page</h1>
      <p className="text-gray-600">Aplikasi B ITech ADM siap menerima notifikasi.</p>

      {/* Form Logout Menggunakan Server Action */}
      <form action={handleSignOut} className="w-full max-w-xs mt-4">
        <button
          type="submit"
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-white border border-gray-200 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 shadow-sm transition"
        >
          <PowerIcon className="w-6" />
          <span>Sign Out</span>
        </button>
      </form>
    </div>
  );
}