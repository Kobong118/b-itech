import { supabase } from '@/lib/supabaseClient'; // Sesuaikan path import supabase Anda
import { verifyDonatur, markAsFakeDonatur } from './actions';
import { redirect } from 'next/navigation';
import { PowerIcon } from '@heroicons/react/24/outline';
import { auth, signOut } from '@/auth'; // 👈 Impor fungsi auth dari konfigurasi utama Auth.js Anda

export default async function AdminDonaturPage() {
    // ==========================================
    // PROTEKSI AUTH ROUTE ADMIN
    // ==========================================
    const session = await auth();

    // Jika belum login atau user tidak ditemukan, lempar ke halaman login
    if (!session || !session.user) {
        redirect('/login'); // Sesuaikan path halaman login Anda
    }
    // ==========================================
    // Ambil data donatur dari database, urutkan dari yang terbaru
    const { data: donaturList, error } = await supabase
        .from('donatur')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return <div className="p-8 text-red-500">Gagal memuat data donatur: {error.message}</div>;
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto bg-slate-50 min-h-screen">
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
                {/* Bagian Judul dan Deskripsi */}
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Panel Verifikasi Hadiah / Donatur</h1>
                    <p className="text-slate-500 text-sm">Kelola konfirmasi transfer dari tamu undangan. Berikan nomor SN/transaksi atau tandai FAKE.</p>
                </div>

                {/* Tombol Sign Out */}
                <form
                    action={async () => {
                        'use server';
                        await signOut({ redirectTo: '/login' });
                    }}
                    className="w-full md:w-auto flex justify-end"
                >
                    <button className="flex h-11 w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                        <PowerIcon className="w-5 h-5 text-slate-500 group-hover:text-red-600" />
                        <span>Sign Out</span>
                    </button>
                </form>
            </div>


            <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                <th className="p-4">Waktu</th>
                                <th className="p-4">Nama & Status</th>
                                <th className="p-4">Nominal</th>
                                <th className="p-4">Lokasi (Lat, Long)</th>
                                <th className="p-4 text-center">Aksi Verifikasi Admin</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                            {donaturList && donaturList.length > 0 ? (
                                donaturList.map((item) => {
                                    // 👇 Berikan fallback string kosong dan angka 0 jika bernilai null
                                    const namaItem = item.nama || '';
                                    const nominalItem = item.nominal || 0;
                                    const isFake = namaItem.includes('[Terbukti FAKE]');
                                    const isVerified = namaItem.includes('[Terverifikasi');

                                    return (
                                        <tr key={item.id} className={`hover:bg-slate-50 ${isFake ? 'bg-red-50/50' : isVerified ? 'bg-emerald-50/30' : ''}`}>
                                            <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                                                {new Date(item.created_at).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 font-medium">
                                                <div className="text-slate-900">{namaItem}</div>
                                                {isVerified && <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full">Terverifikasi</span>}
                                                {isFake && <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">Spam / FAKE</span>}
                                            </td>
                                            <td className="p-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                                                Rp {nominalItem.toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                                                {item.latitude && item.longitude ? (
                                                    <a
                                                        href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-cyan-600 underline hover:text-cyan-800"
                                                    >
                                                        {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                                                    </a>
                                                ) : (
                                                    <span className="text-amber-500">Tidak ada GPS</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* Form Aksi Verifikasi dengan input Nomor Transaksi */}
                                                    <form action={async (formData) => {
                                                        'use server';
                                                        const sn = formData.get('sn')?.toString() || '';
                                                        await verifyDonatur(item.id, sn);
                                                    }} className="flex items-center gap-1">
                                                        <input
                                                            type="text"
                                                            name="sn"
                                                            required
                                                            placeholder="No. Transaksi / SN"
                                                            className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36"
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow transition"
                                                        >
                                                            Valid
                                                        </button>
                                                    </form>

                                                    {/* Tombol FAKE / Spam */}
                                                    <form action={async () => {
                                                        'use server';
                                                        await markAsFakeDonatur(item.id);
                                                    }}>
                                                        <button
                                                            type="submit"
                                                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg transition"
                                                            title="Tandai sebagai spam atau palsu"
                                                        >
                                                            FAKE
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-slate-400">Belum ada data konfirmasi donatur masuk.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}