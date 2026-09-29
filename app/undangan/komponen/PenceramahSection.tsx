'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// Data penceramah (bisa Anda sesuaikan nama, keterangan, dan path fotonya)
const listPenceramah = [
    {
        name: "Abuya Prof.DR. (HC) KH. Muhammad Muhyiddin Abdul Qodir Al Manafi MA.",
        role: "Muballigh",
        institution: "Pondok Pesantren Islam Internasional Terpadu Asy-Syifaa Wal Mahmuudiyyah ",
        image: "/maulid/abuya.png", // Ganti dengan path foto di folder public Anda
        quote: ""
    },{
        name: "KH. Abu Najib",
        role: "Muballigh",
        institution: "Ponpes MADINAH Cimaung",
        image: "/maulid/ustdAbu.png", // Ganti dengan path foto di folder public Anda
        quote: ""
    },{
        name: "KH. Agus Hasanuddin",
        role: "Muballigh",
        institution: "Saung Mulud Al Karomah Ciparay",
        image: "/maulid/ustdAgus.png", // Ganti dengan path foto di folder public Anda
        quote: ""
    },{
        name: "KH.Muhammad Robi",
        role: "Pembacaan Maulid",
        institution: "Jelegong",
        image: "/maulid/ustdRobi.png", // Ganti dengan path foto di folder public Anda
        quote: ""
    },{
        name: "Al Ustadz Fuad Al Furqon",
        role: "Qori",
        institution: "Cicalengka",
        image: "/maulid/ustdFuad.png", // Ganti dengan path foto di folder public Anda
        quote: ""
    },
    // Anda bisa menambahkan objek penceramah lain di sini jika ada lebih dari satu
];

export default function PenceramahSection() {
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
                    Kehadiran Khidmat
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-wide">
                    Muballigh & Qori
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 mx-auto mt-4 rounded-full"></div>
            </motion.div>

            {/* Container Grid Card Penceramah */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl mx-auto">
                {listPenceramah.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.7, delay: index * 0.2 }}
                        className="bg-slate-900/80 border border-cyan-400/40 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md flex flex-col items-center text-center relative overflow-hidden group"
                    >
                        {/* Aksen Garis Atas */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 to-teal-400"></div>

                        {/* Bingkai Foto dengan Efek Glow */}
                        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden mb-6 border-4 border-cyan-500/30 shadow-xl group-hover:border-cyan-400 transition-colors duration-300 bg-slate-950">
                            {/* 
                              Catatan: Gunakan komponen <Image> dari Next.js. 
                              Pastikan file foto sudah diletakkan di folder public/images/ 
                            */}
                            <Image 
                                src={item.image} 
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 144px, 176px"
                                priority
                            />
                        </div>

                        {/* Informasi Penceramah */}
                        <span className="bg-cyan-950/80 text-cyan-300 text-xs font-medium px-3 py-1 rounded-full border border-cyan-500/30 mb-3">
                            {item.role}
                        </span>

                        <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-100 mb-1">
                            {item.name}
                        </h3>

                        <p className="text-cyan-200/90 font-medium text-sm md:text-base mb-4">
                            ({item.institution})
                        </p>

                        <p className="text-slate-300 text-sm italic font-light max-w-md border-t border-slate-800 pt-4 w-full">
                            {/* &ldquo;{item.quote}&rdquo; */}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}