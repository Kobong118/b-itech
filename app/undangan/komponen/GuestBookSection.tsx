'use client';

import { motion } from 'framer-motion';

interface CommentItem {
    id?: string | number;
    name: string;
    status: string;
    message: string;
    created_at?: string;
}

interface GuestBookProps {
    initialComments: CommentItem[];
    addGuestbookEntry: (formData: FormData) => Promise<any>;
    guestName?: string; // 👈 Ditambahkan untuk menerima nama dari cover / URL query param
}

export default function GuestBookSection({ initialComments, addGuestbookEntry, guestName = '' }: GuestBookProps) {
    return (
        <section className="py-16 px-6 bg-[#fbf8f3] border-t border-slate-200">
            <div className="max-w-2xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="text-cyan-700 font-semibold text-xs tracking-widest uppercase block mb-2">Kehadiran & Doa</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900">RSVP & Buku Tamu</h2>
                    <div className="w-16 h-1 bg-cyan-600 mx-auto mt-4 rounded-full"></div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false}}
                    transition={{ duration: 0.7 }}
                    className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl mb-10"
                >
                    <form action={async (formData) => {
                        await addGuestbookEntry(formData)
                    }} onSubmit={(e) => {
                        setTimeout(() => {
                            (e.target as HTMLFormElement).reset()
                        }, 500)
                    }} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Nama Lengkap</label>
                            <input 
                                type="text" 
                                name="name" 
                                required 
                                defaultValue={guestName} // 👈 Terisi otomatis sesuai nama penerima undangan
                                readOnly={Boolean(guestName)} // 👈 Dikunci (readonly) jika nama dari undangan tersedia
                                placeholder="Masukkan nama Anda..." 
                                className={`w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 text-sm ${guestName ? 'bg-neutral-200/60 text-slate-700 cursor-not-allowed' : 'bg-neutral-50'}`} 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Konfirmasi Kehadiran</label>
                            <select name="status" className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 text-sm bg-neutral-50">
                                <option value="Hadir">Insya Allah Hadir</option>
                                <option value="Berhalangan">Maaf, Berhalangan Hadir</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Ucapan & Doa</label>
                            <textarea name="message" required rows={3} placeholder="Tuliskan ucapan selamat atau doa..." className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 text-sm bg-neutral-50"></textarea>
                        </div>

                        <button type="submit" className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-700 hover:brightness-110 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer">
                            🚀 Kirim Konfirmasi & Ucapan
                        </button>
                    </form>
                </motion.div>

                {/* Comments Render List */}
                <div className="space-y-4">
                    <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">Daftar Ucapan & Doa Jamaah</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {initialComments.length === 0 ? (
                            <p className="text-sm text-neutral-500 text-center italic">Belum ada ucapan. Jadilah yang pertama memberikan doa!</p>
                        ) : (
                            initialComments.map((c, idx) => {
                                const isHadir = c.status === 'Hadir'
                                return (
                                    <motion.div 
                                        key={c.id || Math.random()} 
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: false}}
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${isHadir ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                                                {c.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-600 leading-relaxed">{c.message}</p>
                                        <span className="text-[10px] text-neutral-400 block text-right">
                                            {c.created_at ? new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Baru saja'}
                                        </span>
                                    </motion.div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}