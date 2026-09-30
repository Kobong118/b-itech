'use client';

import { motion } from 'framer-motion';

interface GiftItem {
    id: string | number;
    nama: string | null;
    nominal: number | null;
    created_at?: string;
}

interface GiftListProps {
    gifts: GiftItem[];
}

export default function GiftListSection({ gifts }: GiftListProps) {
    // Fungsi format angka ke Rupiah
    const formatRupiah = (number: number | null | undefined) => {
        const safeNumber = typeof number === 'number' && Number.isFinite(number) ? number : 0;

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(safeNumber);
    };

    return (
        <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
            >
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
                    Daftar Konfirmasi Tanda Kasih
                </h3>
                <p className="text-slate-500 text-xs md:text-sm mt-1">
                    Terima kasih atas infaq dan tanda kasih yang telah diberikan.
                </p>
                <div className="w-16 h-1 bg-cyan-500 mx-auto mt-3 rounded-full"></div>
            </motion.div>

            {/* Container List Card */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-4 md:p-6 shadow-xl max-h-[400px] overflow-y-auto space-y-3">
                {(!gifts || gifts.length === 0) ? (
                    <div className="text-center py-8 text-slate-400 text-sm italic">
                        Belum ada konfirmasi tanda kasih yang tercatat.
                    </div>
                ) : (
                    gifts.map((gift, index) => (
                        <motion.div
                            key={gift.id || index}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-cyan-300 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                {/* Icon / Avatar Inisial */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
                                    {gift.nama ? gift.nama.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm md:text-base flex flex-wrap items-center gap-2">
                                        {/* 1. Menampilkan nama asli tanpa teks di dalam kurung siku */}
                                        <span>
                                            {gift.nama ? gift.nama.replace(/\[.*?\]/g, '').trim() : ''}
                                        </span>

                                        {/* 2. Lencana / Badge Terverifikasi */}
                                        {gift.nama && gift.nama.includes('[Terverifikasi') && (() => {
                                            const match = gift.nama.match(/\[Terverifikasi\s*:\s*(.*?)\]/);
                                            const snValue = match ? match[1] : '';
                                            return (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                    ✅ Terverifikasi {snValue ? `: ${snValue}` : ''}
                                                </span>
                                            );
                                        })()}

                                        {/* 3. Lencana / Badge FAKE / Spam */}
                                        {gift.nama && gift.nama.includes('[Terbukti FAKE]') && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
                                                ⚠️ Terbukti FAKE
                                            </span>
                                        )}
                                    </h4>
                                    <span className="text-[11px] text-slate-400">
                                        {gift.created_at ? new Date(gift.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 'Baru saja'}
                                    </span>
                                </div>
                            </div>

                            {/* Badge Nominal */}
                            <div className="text-right">
                                <span className="bg-cyan-50 text-cyan-700 border border-cyan-200/60 px-3 py-1.5 rounded-xl font-mono font-bold text-xs md:text-sm shadow-inner inline-block">
                                    {/* {formatRupiah(gift.nominal)} */} *******
                                </span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </section>
    );
}