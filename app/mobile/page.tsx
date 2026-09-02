import { PushNotifications } from '@capacitor/push-notifications';

const initPushNotifications = async () => {
  // 1. Minta izin notifikasi ke pengguna
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive === 'granted') {
    // 2. Registrasi perangkat ke FCM
    await PushNotifications.register();
  }

  // 3. Dapatkan Token FCM untuk dikirim ke Server / Backend
  PushNotifications.addListener('registration', (token) => {
    console.log('FCM Token:', token.value);
    // Kirim token.value ini ke database server kamu
  });

  // 4. Handle ketika notifikasi diterima saat app terbuka
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Notifikasi diterima:', notification);
  });
};

initPushNotifications();

export default function Page() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Mobile Page</h1>
      <p className="text-gray-600">This is a mobile page.</p>
    </div>
  );
}