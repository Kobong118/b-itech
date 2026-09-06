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

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/mobile';

    const [isRegister, setIsRegister] = useState(false);

    // State Server Action untuk Login
    const [errorMessage, formAction, isPending] = useActionState(
        authenticateMobile,
        undefined,
    );

    // State Input Login & Pendaftaran
    const [identitas, setIdentitas] = useState('');
    const [password, setPassword] = useState('');
    
    // State Pendaftaran Baru
    const [nama, setNama] = useState('');
    const [kontak, setKontak] = useState('');
    const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    // State UI
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const [regLoading, setRegLoading] = useState(false);
    const [regErrorMessage, setRegErrorMessage] = useState('');

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

    const handleSyncToken = async (jamaahId: number, tokenToSync?: string | null) => {
        const activeToken = tokenToSync || fcmToken;
        if (activeToken && jamaahId) {
            await syncJamaahFcmToken(activeToken, jamaahId);
        }
    };

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

    // Submit Pendaftaran Jamaah Baru dengan Validasi PIN Match
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegLoading(true);
        setRegErrorMessage('');

        try {
            const namaTrim = nama.trim();
            const kontakNum = Number(kontak.trim());
            const pinNum = Number(pin.trim());

            if (isNaN(kontakNum)) {
                setRegErrorMessage('Nomor WhatsApp harus berupa angka.');
                setRegLoading(false);
                return;
            }

            // Validasi PIN
            if (!pin || pin.length < 6) {
                setRegErrorMessage('PIN minimal harus 6 digit angka.');
                setRegLoading(false);
                return;
            }

            // Validasi Match PIN
            if (pin !== confirmPin) {
                setRegErrorMessage('PIN dan Konfirmasi PIN tidak cocok!');
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
                pin: pinNum,
            });

            if (res.success && res.jamaah) {
                if (res.jamaah.id) {
                    await handleSyncToken(Number(res.jamaah.id));
                }
                router.push('/mobile');
                router.refresh();
            } else {
                setRegErrorMessage(res.message ?? 'Gagal memproses pendaftaran jamaah baru.');
            }
        } catch (err) {
            console.error('Error register:', err);
            setRegErrorMessage('Gagal memproses pendaftaran jamaah baru.');
        } finally {
            setRegLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl shadow-slate-100 border border-slate-100">
            <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-xl shadow-lg shadow-blue-200">
                    B
                </div>
                <h1 className="text-xl font-bold text-slate-800">B ITech ADM</h1>
                <p className="mt-1 text-xs text-slate-500">
                    {isRegister ? 'Pendaftaran Jamaah Baru' : 'Masuk ke Portal Jamaah'}
                </p>
            </div>

            {(errorMessage || regErrorMessage) && (
                <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100 text-center">
                    {isRegister ? regErrorMessage : errorMessage}
                </div>
            )}

            {!isRegister ? (
                /* Form Login */
                <form action={formAction} onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="identitas">
                            No. WhatsApp / Nama Jamaah
                        </label>
                        <input
                            id="identitas"
                            name="identitas"
                            type="text"
                            value={identitas || ''}
                            onChange={(e) => setIdentitas(e.target.value)}
                            required
                            placeholder="Contoh: 08123456789 atau Ahmad"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="pin">
                            PIN / Kata Sandi
                        </label>
                        <input
                            id="pin"
                            name="pin"
                            type="password"
                            maxLength={6}
                            value={password || ''}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="6 digit PIN"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

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
                /* Form Register */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Nama Lengkap
                        </label>
                        <input
                            name="nama"
                            type="text"
                            required
                            placeholder="Nama Lengkap Jamaah"
                            value={nama || ''}
                            onChange={(e) => setNama(e.target.value)}
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
                            value={kontak || ''}
                            onChange={(e) => setKontak(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Jenis Kelamin
                        </label>
                        <select
                            name="jenis_kelamin"
                            value={jenisKelamin}
                            onChange={(e) => setJenisKelamin(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Buat PIN (6 Digit)
                        </label>
                        <input
                            name="pin"
                            type="password"
                            maxLength={6}
                            required
                            placeholder="Contoh: 123456"
                            value={pin || ''}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Konfirmasi PIN
                        </label>
                        <input
                            name="confirmPin"
                            type="password"
                            maxLength={6}
                            required
                            placeholder="Ulangi 6 digit PIN"
                            value={confirmPin || ''}
                            onChange={(e) => setConfirmPin(e.target.value)}
                            className={`w-full rounded-xl border p-3 text-sm text-slate-800 outline-none transition bg-slate-50 focus:bg-white focus:ring-2 ${
                                confirmPin && pin !== confirmPin
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                            }`}
                        />
                        {confirmPin && pin !== confirmPin && (
                            <p className="mt-1 text-[10px] text-red-500">PIN tidak cocok</p>
                        )}
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
    );
}