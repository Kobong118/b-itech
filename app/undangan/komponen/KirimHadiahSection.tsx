'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface KirimHadiahProps {
    guestName?: string;
    addHadiahConfirmation?: (formData: FormData) => Promise<any>;
}

export default function KirimHadiahSection({ guestName = '', addHadiahConfirmation }: KirimHadiahProps) {
    const [copied, setCopied] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [locationStatus, setLocationStatus] = useState('');

    // Ganti nomor rekening dan nama pemilik sesuai data Anda
    const noRekening = "1921083803";
    const namaPemilik = "SITI NURHALIMAH ALAWIYYAH";

    const handleCopy = () => {
        navigator.clipboard.writeText(noRekening);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    // Fungsi untuk mendapatkan koordinat GPS perangkat
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('Geolocation tidak didukung oleh browser Anda.');
            return;
        }

        setLoadingLocation(true);
        setLocationStatus('Mengambil lokasi perangkat...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude.toString());
                setLongitude(position.coords.longitude.toString());
                setLocationStatus('✅ Lokasi berhasil didapatkan!');
                setLoadingLocation(false);
            },
            (error) => {
                console.error(error);
                setLocationStatus('❌ Gagal mengambil lokasi. Izinkan akses GPS.');
                setLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto bg-[#fbf8f3]">
            {/* Judul Section */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.7 }}
                className="text-center mb-12"
            >
                <span className="text-cyan-700 text-sm font-semibold tracking-widest uppercase block mb-2">
                    Infaq & Tanda Kasih
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-wide">
                    Kirim Hadiah / Dompet Digital
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 mx-auto mt-4 rounded-full"></div>
                <p className="text-slate-500 text-sm md:text-base mt-4 max-w-lg mx-auto font-light">
                    Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih secara cashless, dapat melalui rekening berikut:
                </p>
            </motion.div>

            {/* Card Rekening BNI */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.7 }}
                className="bg-slate-900/80 border border-cyan-400/40 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden max-w-md mx-auto text-center"
            >
                {/* Aksen Garis Atas */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 to-teal-400"></div>

                {/* Logo Bank BNI dari File SVG */}
                <div className="flex justify-center mb-6 mt-2">
                    <div className="bg-white/90 px-6 py-2.5 rounded-xl shadow-md border border-cyan-500/20 flex items-center justify-center">
                        <Image
                            src="/maulid/bni-logo.svg"
                            alt="Bank BNI"
                            width={110}
                            height={35}
                            style={{ width: 'auto', height: 'auto' }}
                            className="h-8 w-auto object-contain"
                        />
                    </div>
                </div>

                {/* Nomor Rekening */}
                <div className="mb-4">
                    <span className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Nomor Rekening</span>
                    <div className="text-2xl md:text-3xl font-mono font-bold text-cyan-200 tracking-wider bg-slate-950/60 py-3 px-4 rounded-xl border border-cyan-500/20 shadow-inner inline-block w-full">
                        {noRekening}
                    </div>
                </div>

                {/* Atas Nama */}
                <div className="mb-6">
                    <span className="text-slate-400 text-xs uppercase tracking-wider block mb-0.5">Atas Nama</span>
                    <p className="text-slate-100 font-semibold text-base md:text-lg">
                        {namaPemilik}
                    </p>
                </div>

                {/* Tombol Salin */}
                <button
                    onClick={handleCopy}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-110 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all border border-cyan-400/30 active:scale-95 cursor-pointer"
                >
                    {copied ? (
                        <>✅ Berhasil Disalin!</>
                    ) : (
                        <>📋 Salin Nomor Rekening</>
                    )}
                </button>

                {/* Catatan kecil */}
                <p className="text-slate-400 text-xs mt-4 italic mb-6">
                    *Harap konfirmasi jika telah melakukan pengiriman tanda kasih. Terima kasih.
                </p>

                {/* ========================================= */}
                {/* FORM KONFIRMASI PENGIRIMAN HADIAH          */}
                {/* ========================================= */}
                <div className="border-t border-slate-800 pt-6 mt-6 text-left">
                    <h4 className="font-serif text-lg font-bold text-slate-100 mb-1 text-center">
                        Konfirmasi Transfer Hadiah
                    </h4>
                    <p className="text-xs text-slate-400 text-center mb-6">
                        Isi form di bawah ini setelah Anda melakukan transfer agar tercatat oleh tuan rumah.
                    </p>

                    <form
                        action={async (formData) => {
                            if (addHadiahConfirmation) {
                                // 👇 Menangkap hasil balasan dari Server Action
                                const result = await addHadiahConfirmation(formData);

                                if (result) {
                                    if (!result.success) {
                                        // Tampilkan pesan error validasi server
                                        alert(result.message || 'Terjadi kesalahan.');
                                    } else {
                                        // Tampilkan pesan sukses
                                        alert(result.message || 'Konfirmasi berhasil dikirim!');
                                    }
                                }
                            }
                        }}
                        onSubmit={(e) => {
                            setTimeout(() => {
                                (e.target as HTMLFormElement).reset();
                                setLatitude('');
                                setLongitude('');
                                setLocationStatus('');
                            }, 500);
                        }}
                        className="space-y-4"
                    >
                        {/* Nama Pengirim */}
                        <div>
                            <label className="block text-xs font-semibold uppercase text-cyan-300 mb-1">
                                Nama Lengkap Pengirim
                            </label>
                            {guestName && <input type="hidden" name="name" value={guestName} />}
                            <input
                                type="text"
                                name={guestName ? undefined : "name"}
                                required
                                defaultValue={guestName}
                                readOnly={Boolean(guestName)}
                                placeholder="Nama Anda..."
                                className={`w-full px-4 py-2.5 rounded-xl border border-cyan-500/30 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${guestName ? 'bg-slate-950/80 text-cyan-200 cursor-not-allowed' : 'bg-slate-950/50'}`}
                            />
                        </div>

                        {/* Nominal Uang */}
                        <div>
                            <label className="block text-xs font-semibold uppercase text-cyan-300 mb-1">
                                Nominal Uang (Rp)
                            </label>
                            <input
                                type="number"
                                name="amount"
                                required
                                placeholder="Contoh: 100000"
                                onKeyDown={(e) => {
                                    if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="w-full px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-slate-950/50 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                        </div>

                        {/* Latitude & Longitude */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Latitude</label>
                                <input
                                    type="number"
                                    name="latitude"
                                    value={latitude}
                                    readOnly
                                    placeholder="Otomatis"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-slate-300 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Longitude</label>
                                <input
                                    type="number"
                                    name="longitude"
                                    value={longitude}
                                    readOnly
                                    placeholder="Otomatis"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-slate-300 font-mono"
                                />
                            </div>
                        </div>

                        {/* Tombol Ambil Lokasi GPS */}
                        <div>
                            <button
                                type="button"
                                onClick={handleGetLocation}
                                disabled={loadingLocation}
                                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loadingLocation ? '🔄 Mendeteksi Lokasi...' : '📍 Ambil Koordinat Lokasi Saya'}
                            </button>
                            {locationStatus && (
                                <p className={`text-[11px] mt-1.5 text-center ${locationStatus.includes('✅') ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {locationStatus}
                                </p>
                            )}
                        </div>

                        {/* Tombol Submit Konfirmasi */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-110 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer border border-cyan-400/30 mt-2"
                        >
                            📤 Kirim Konfirmasi Transfer
                        </button>
                    </form>
                </div>
            </motion.div>
        </section>
    );
}