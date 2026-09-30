import { motion } from 'framer-motion';

export default function EventDetailSection() {
    return (
        <section id="acara" className="py-16 px-6 bg-[#fbf8f3] text-neutral-800">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center mb-12"
            >
                <span className="text-cyan-700 font-semibold text-xs tracking-widest uppercase block mb-2">Waktu & Tempat</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900">Rangkaian & Lokasi Acara</h2>
                <div className="w-16 h-1 bg-cyan-600 mx-auto mt-4 rounded-full"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.7 }}
                    className="bg-slate-900/80 border border-cyan-400/40 rounded-2xl p-8 shadow-2xl backdrop-blur-md flex flex-col items-center text-center relative overflow-hidden text-white"
                >
                    {/* Garis aksen atas */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 to-teal-400"></div>

                    {/* Ikon */}
                    <div className="w-16 h-16 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-2xl mb-4 shadow-inner">
                        📅
                    </div>

                    <p className="font-semibold text-cyan-200 mb-1 text-base md:text-lg">
                        Khusus Akhwat
                    </p>

                    {/* Judul */}
                    <h3 className="font-serif text-xl font-bold text-slate-100 mb-2 tracking-wide">
                        Siang Hari
                    </h3>

                    {/* Tanggal */}
                    <p className="font-semibold text-cyan-200 mb-1 text-base md:text-lg">
                        Hari Ahad, 23 Rabi'ul Akhir 1448 H
                    </p>
                    <p className="text-sm text-slate-300 mb-4 font-light">
                        Bertepatan dengan 4 Oktober 2026
                    </p>

                    {/* Kotak Jam */}
                    <div className="inline-block bg-slate-800/90 text-cyan-200 px-4 py-2 rounded-xl text-sm font-medium border border-cyan-500/30 shadow-md mb-4">
                        Pukul 07.30 WIB s.d. 11.00 WIB
                    </div>

                    {/* Penceramah */}
                    <div className="text-xs md:text-sm text-slate-300 font-light border-t border-slate-800 pt-4 w-full">
                        <span className="text-slate-400 block mb-1">Bersama:</span>
                        <strong className="text-cyan-100 font-semibold block text-sm md:text-base">
                            Ustadzah Hj. Dewi Siti Juariyah
                        </strong>
                        <span className="text-cyan-300/80 italic text-xs mt-0.5 block">
                            (Pondok Pesantren Al-Burdah)
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.7 }}
                    className="bg-slate-900/80 border border-cyan-400/40 rounded-2xl p-8 shadow-2xl backdrop-blur-md flex flex-col items-center text-center relative overflow-hidden text-white"
                >
                    {/* Garis aksen atas */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 to-teal-400"></div>

                    {/* Ikon */}
                    <div className="w-16 h-16 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-2xl mb-4 shadow-inner">
                        📅
                    </div>

                    <p className="font-semibold text-cyan-200 mb-1 text-base md:text-lg">
                        Terbuka Untuk Umum
                    </p>

                    {/* Judul */}
                    <h3 className="font-serif text-xl font-bold text-slate-100 mb-2 tracking-wide">
                        Malam Hari
                    </h3>

                    {/* Tanggal */}
                    <p className="font-semibold text-cyan-200 mb-1 text-base md:text-lg">
                        Malam Senin, 24 Rabi'ul Akhir 1448 H
                    </p>
                    <p className="text-sm text-slate-300 mb-4 font-light">
                        Bertepatan dengan 4 Oktober 2026
                    </p>

                    {/* Kotak Jam */}
                    <div className="inline-block bg-slate-800/90 text-cyan-200 px-4 py-2 rounded-xl text-sm font-medium border border-cyan-500/30 shadow-md mb-4">
                        Pukul 19.30 WIB s.d. Selesai
                    </div>

                    {/* Penceramah 1*/}
                    <div className="text-xs md:text-sm text-slate-300 font-light border-t border-slate-800 pt-4 w-full">
                        <span className="text-slate-400 block mb-1">Bersama:</span>
                        <strong className="text-cyan-100 font-semibold block text-sm md:text-base">
                            Abuya Prof.DR. (HC) KH. Muhammad Muhyiddin Abdul Qodir Al Manafi MA.
                        </strong>
                        <span className="text-cyan-300/80 italic text-xs mt-0.5 block">
                            (Pondok Pesantren Islam Internasional Terpadu Asy-Syifaa Wal Mahmuudiyyah)
                        </span>
                    </div>
                    {/* Penceramah 2*/}
                    <div className="text-xs md:text-sm text-slate-300 font-light border-t border-slate-800 pt-4 w-full mt-2">
                        {/* <span className="text-slate-400 block mb-1">Bersama:</span> */}
                        <strong className="text-cyan-100 font-semibold block text-sm md:text-base">
                            KH. Abu Najib
                        </strong>
                        <span className="text-cyan-300/80 italic text-xs mt-0.5 block">
                            (Ponpes MADINAH Cimaung)
                        </span>
                    </div>
                    {/* Penceramah 3*/}
                    <div className="text-xs md:text-sm text-slate-300 font-light border-t border-slate-800 pt-4 w-full mt-2">
                        {/* <span className="text-slate-400 block mb-1">Bersama:</span> */}
                        <strong className="text-cyan-100 font-semibold block text-sm md:text-base">
                            KH. Agus Hasanuddin
                        </strong>
                        <span className="text-cyan-300/80 italic text-xs mt-0.5 block">
                            (Saung Mulud Al Karomah Ciparay)
                        </span>
                    </div>
                    {/* Penceramah 4*/}
                    <div className="text-xs md:text-sm text-slate-300 font-light border-t border-slate-800 pt-4 w-full">
                        {/* <span className="text-slate-400 block mb-1">Bersama:</span> */}
                        <strong className="text-cyan-100 font-semibold block text-sm md:text-base">
                            KH.Muhammad Robi
                        </strong>
                        <span className="text-cyan-300/80 italic text-xs mt-0.5 block">
                            (Jelegong)
                        </span>
                    </div>
                    {/* Penceramah 5*/}
                    <div className="text-xs md:text-sm text-slate-300 font-light border-t border-slate-800 pt-4 w-full">
                        {/* <span className="text-slate-400 block mb-1">Bersama:</span> */}
                        <strong className="text-cyan-100 font-semibold block text-sm md:text-base">
                            Qori:Al Ustadz Fuad Al Furqon
                        </strong>
                        <span className="text-cyan-300/80 italic text-xs mt-0.5 block">
                            (Cicalengka)
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.7 }}
                    className="bg-slate-900/80 border border-cyan-400/40 rounded-2xl p-8 shadow-2xl backdrop-blur-md flex flex-col items-center text-center relative overflow-hidden text-white"
                >
                    {/* Garis aksen atas */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-cyan-400"></div>

                    {/* Ikon */}
                    <div className="w-16 h-16 rounded-full bg-cyan-950/80 text-teal-300 border border-teal-500/40 flex items-center justify-center text-2xl mb-4 shadow-inner">
                        📍
                    </div>

                    {/* Judul */}
                    <h3 className="font-serif text-xl font-bold text-slate-100 mb-2 tracking-wide">
                        Lokasi Acara
                    </h3>

                    {/* Nama Tempat */}
                    <p className="font-semibold text-cyan-200 mb-1 text-base md:text-lg">
                        Majlis Ta'lim Al-Ukhuwwah Daarul Mushthofa
                    </p>
                    <p className="text-sm text-slate-300 mb-6 font-light max-w-sm">
                        Kp. Bunisari RT 04 RW 04 Desa Padasuka Kec. Kutawaringin Kab. Bandung
                    </p>

                    {/* Preview Embed Google Maps (Opsional / Placeholder interaktif iframe) */}
                    <div className="w-full h-44 rounded-xl overflow-hidden border border-cyan-500/30 mb-6 relative shadow-inner bg-slate-950">
                        <iframe
                            title="Google Maps Lokasi"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.3019!2d107.518!3d-7.025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDEnMzAuMCJTIDEwN8KwMzEnMDQuOCJF!5e0!3m2!1sid!2sid!4v1650000000000!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'contrast(110%) invert(90%) hue-rotate(180st)' }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    {/* Tombol Buka Maps */}
                    <a
                        href="https://maps.app.goo.gl/ipJhxysu4Qo659jcA"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-110 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all border border-cyan-400/30"
                    >
                        🗺️ Buka Google Maps
                    </a>
                </motion.div>
            </div>
        </section>
    );
}