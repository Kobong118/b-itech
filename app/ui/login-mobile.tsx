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
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="noRek">
              No. Rekening
            </label>
            <input
              id="noRek"
              name="noRek"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={13}
              required
              placeholder="Masukan 13 digit nomor rekening"
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
              Bagi jamaah yang telah daftar melalui Panitia, silahkan masukkan nomor rekening. Butuh bantuan? {' '}
              <a
                href={`https://wa.me/6281220206315?text=${encodeURIComponent(
                  "Halo, saya ingin mendapatkan informasi lebih lanjut."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-xl bg-green-500 px-5 py-3 font-medium text-white shadow-sm transition-all hover:bg-green-600 hover:shadow-md active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M20.52 3.449A11.817 11.817 0 0 0 12.052.003C5.495.003.16 5.338.157 11.895c0 2.09.546 4.13 1.582 5.93L.09 23.91l6.224-1.633a11.84 11.84 0 0 0 5.738 1.46h.005c6.557 0 11.892-5.335 11.895-11.892a11.81 11.81 0 0 0-3.432-8.396zM12.057 21.73h-.004a9.83 9.83 0 0 1-5.01-1.372l-.36-.214-3.694.969.986-3.604-.234-.37a9.83 9.83 0 0 1-1.51-5.244c.003-5.445 4.436-9.878 9.882-9.878 2.64.001 5.12 1.03 6.985 2.897a9.84 9.84 0 0 1 2.89 6.994c-.002 5.446-4.435 9.878-9.881 9.878z" />
                </svg>

                <span>Chat via WhatsApp</span>
              </a>
            </p>
          </div>

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
              type="text"
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