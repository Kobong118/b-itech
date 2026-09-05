'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { authenticateMobile } from '@/app/lib/aksi';
import {
  syncJamaahFcmToken,
  checkNamaExists,
  insertNewJamaah,
  getJamaahIdByIdentitas,
} from '@/app/lib/supabaseQuery';

export default function MobileLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/mobile';

  const [isRegister, setIsRegister] = useState(false);

  // State Server Action untuk Login
  const [errorMessage, formAction, isPending] = useActionState(
    authenticateMobile,
    undefined,
  );

  // State Input Pendaftaran
  const [nama, setNama] = useState('');
  const [kontak, setKontak] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');

  // State UI Tambahan
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regErrorMessage, setRegErrorMessage] = useState('');

  // 1. Ambil FCM Token jika berjalan di Mobile Native
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.addListener('registration', (token) => {
        setFcmToken(token.value);
      });
    }
  }, []);

  // 2. Helper Sinkronisasi FCM Token
  const handleSyncToken = async (jamaahId: number) => {
    if (fcmToken && jamaahId) {
      await syncJamaahFcmToken(fcmToken, jamaahId);
    }
  };

  // 3. Sync Token otomatis saat login berhasil diproses
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const identitasVal = formData.get('identitas')?.toString();

    if (identitasVal) {
      const jamaahId = await getJamaahIdByIdentitas(identitasVal);
      if (jamaahId) {
        await handleSyncToken(jamaahId);
      }
    }
  };

  // 4. Handler Submit Pendaftaran Jamaah Baru
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegErrorMessage('');

    try {
      const namaTrim = nama.trim();
      const kontakNum = Number(kontak.trim());

      if (isNaN(kontakNum)) {
        setRegErrorMessage('Nomor WhatsApp harus berupa angka.');
        setRegLoading(false);
        return;
      }

      const isExist = await checkNamaExists(namaTrim);
      if (isExist) {
        setRegErrorMessage('Nama ini sudah terdaftar. Silakan gunakan nama lain atau login.');
        setRegLoading(false);
        return;
      }

      const res = await insertNewJamaah({
        nama: namaTrim,
        kontak: kontakNum,
        jenis_kelamin: jenisKelamin,
      });

      if (res.success && res.jamaah) {
        if (res.jamaah.id) {
          await handleSyncToken(Number(res.jamaah.id));
        }
        router.push('/mobile');
        router.refresh();
      } else {
        setRegErrorMessage(res.message);
      }
    } catch (err) {
      console.error('Error register:', err);
      setRegErrorMessage('Gagal memproses pendaftaran jamaah baru.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl shadow-slate-100 border border-slate-100">
        
        {/* Header App */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-xl shadow-lg shadow-blue-200">
            B
          </div>
          <h1 className="text-xl font-bold text-slate-800">B ITech ADM</h1>
          <p className="mt-1 text-xs text-slate-500">
            {isRegister ? 'Pendaftaran Jamaah Baru' : 'Masuk ke Portal Jamaah'}
          </p>
        </div>

        {/* Alert Error Message */}
        {(errorMessage || regErrorMessage) && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100 text-center">
            {isRegister ? regErrorMessage : errorMessage}
          </div>
        )}

        {/* Form Login (Menggunakan Server Action & useActionState) */}
        {!isRegister ? (
          <form action={formAction} onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="identitas">
                No. WhatsApp / Nama Jamaah
              </label>
              <input
                id="identitas"
                name="identitas"
                type="text"
                required
                placeholder="Contoh: 08123456789 atau Ahmad"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Input Redirect URL Tersembunyi */}
            <input type="hidden" name="redirectTo" value={callbackUrl} />

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-blue-600 p-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? 'Memproses...' : 'Masuk Aplikasi'}
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
          /* Form Pendaftaran */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                placeholder="Nama Lengkap Jamaah"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. WhatsApp (Angka)
              </label>
              <input
                type="tel"
                required
                placeholder="08123456789"
                value={kontak}
                onChange={(e) => setKontak(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={regLoading}
              className="w-full rounded-xl bg-emerald-600 p-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
            >
              {regLoading ? 'Mendaftarkan...' : 'Daftar & Masuk'}
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
    </div>
  );
}