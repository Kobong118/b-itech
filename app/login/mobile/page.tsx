'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import {
  syncJamaahFcmToken,
  checkNamaExists,
  insertNewJamaah,
  getJamaahIdByIdentitas,
} from '@/app/lib/supabaseQuery';

export default function MobileLoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  // State Input Login
  const [identitas, setIdentitas] = useState('');

  // State Input Pendaftaran
  const [nama, setNama] = useState('');
  const [kontak, setKontak] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');

  // State UI
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Ambil FCM Token jika berjalan di Mobile Native (Android)
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

  // 3. Handler Submit Login via NextAuth
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await signIn('credentials', {
        identitas,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage('Data jamaah tidak ditemukan. Silakan periksa kembali atau daftar.');
      } else if (res?.ok) {
        // Ambil ID jamaah via helper module
        const jamaahId = await getJamaahIdByIdentitas(identitas);

        if (jamaahId) {
          await handleSyncToken(jamaahId);
        }

        router.push('/mobile');
        router.refresh();
      }
    } catch (err) {
      console.error('Error login:', err);
      setErrorMessage('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handler Submit Pendaftaran Jamaah Baru
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const namaTrim = nama.trim();
      const kontakNum = Number(kontak.trim());

      if (isNaN(kontakNum)) {
        setErrorMessage('Nomor WhatsApp harus berupa angka.');
        setLoading(false);
        return;
      }

      // Cek apakah nama sudah terdaftar
      const isExist = await checkNamaExists(namaTrim);
      if (isExist) {
        setErrorMessage('Nama ini sudah terdaftar. Silakan gunakan nama lain atau login.');
        setLoading(false);
        return;
      }

      // Insert jamaah baru
      const res = await insertNewJamaah({
        nama: namaTrim,
        kontak: kontakNum,
        jenis_kelamin: jenisKelamin,
      });

      if (res.success && res.jamaah) {
        // Auto-login menggunakan NextAuth
        const loginRes = await signIn('credentials', {
          identitas: String(kontakNum),
          redirect: false,
        });

        if (loginRes?.ok) {
          await handleSyncToken(Number(res.jamaah.id));
          router.push('/mobile');
          router.refresh();
        }
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      console.error('Error register:', err);
      setErrorMessage('Gagal memproses pendaftaran jamaah baru.');
    } finally {
      setLoading(false);
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

        {/* Alert Message Error */}
        {errorMessage && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100 text-center">
            {errorMessage}
          </div>
        )}

        {/* Form Login */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. WhatsApp / Nama Jamaah
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 08123456789 atau Ahmad"
                value={identitas}
                onChange={(e) => setIdentitas(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 p-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk Aplikasi'}
            </button>

            <div className="pt-2 text-center">
              <p className="text-xs text-slate-500">
                Belum terdaftar?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMessage('');
                  }}
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
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 p-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Mendaftarkan...' : 'Daftar & Masuk'}
            </button>

            <div className="pt-2 text-center">
              <p className="text-xs text-slate-500">
                Sudah terdaftar?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setErrorMessage('');
                  }}
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