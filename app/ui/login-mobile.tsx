'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { authenticateMobile, registerJamaahMobile } from '@/app/lib/aksi';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/mobile';

  const [isRegister, setIsRegister] = useState(false);
  const [fcmToken, setFcmToken] = useState<string>('');

  // 1. Server Actions
  const [loginState, loginAction, isLoginPending] = useActionState(
    authenticateMobile,
    undefined,
  );

  const [regState, regAction, isRegPending] = useActionState(
    registerJamaahMobile,
    undefined,
  );

  // 2. Inisialisasi & Listener FCM Token
  useEffect(() => {
    const initPushNotifications = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          let permStatus = await PushNotifications.checkPermissions();
          if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
          }

          if (permStatus.receive === 'granted') {
            await PushNotifications.register();
          }
        } catch (err) {
          console.error('Error inisialisasi push notification:', err);
        }
      }
    };

    let tokenListener: any;
    if (Capacitor.isNativePlatform()) {
      tokenListener = PushNotifications.addListener('registration', (token) => {
        setFcmToken(token.value);
      });

      initPushNotifications();
    }

    return () => {
      if (tokenListener) {
        tokenListener.remove();
      }
    };
  }, []);

  const alertMessage = isRegister ? regState?.message : loginState?.message;

  return (
    <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl shadow-slate-100 border border-slate-100">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-xl shadow-lg shadow-blue-200">
          B
        </div>
        <h1 className="text-xl font-bold text-slate-800">B ITech ADM</h1>
        <p className="mt-1 text-xs text-slate-500">
          {isRegister ? 'Pendaftaran Jamaah Baru' : 'Masuk ke Portal Jamaah'}
        </p>
      </div>

      {/* Alert Error */}
      {alertMessage && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100 text-center">
          {alertMessage}
        </div>
      )}

      {/* Form Login */}
      {!isRegister ? (
        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="identitas">
              No. WhatsApp / No. Rekening
            </label>
            <input
              id="identitas"
              name="identitas"
              type="number"
              required
              placeholder="Contoh: No Whatsapp 8123456789 atau No Rekening 1234567890"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Hidden inputs untuk meta data */}
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <input type="hidden" name="fcmToken" value={fcmToken} />

          <button
            type="submit"
            disabled={isLoginPending}
            className="w-full rounded-xl bg-blue-600 p-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoginPending ? 'Memproses...' : 'Masuk Aplikasi'}
          </button>

          <div className="pt-2 text-center">
            <p className="text-xs text-slate-500">
              Belum terdaftar?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="font-bold text-blue-600 hover:underline"
              >
                Daftar di sini
              </button>
            </p>
          </div>
        </form>
      ) : (
        /* Form Register */
        <form action={regAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <input
              name="nama"
              type="text"
              required
              placeholder="Nama Lengkap Jamaah"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              No. WhatsApp (Angka)
            </label>
            <input
              name="kontak"
              type="tel"
              required
              placeholder="08123456789"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jenis Kelamin
            </label>
            <select
              name="jenis_kelamin"
              required
              defaultValue="Laki-laki"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {/* Hidden FCM Token */}
          <input type="hidden" name="fcmToken" value={fcmToken} />

          <button
            type="submit"
            disabled={isRegPending}
            className="w-full rounded-xl bg-emerald-600 p-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
          >
            {isRegPending ? 'Mendaftarkan...' : 'Daftar & Masuk'}
          </button>

          <div className="pt-2 text-center">
            <p className="text-xs text-slate-500">
              Sudah terdaftar?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="font-bold text-blue-600 hover:underline"
              >
                Kembali ke Login
              </button>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}