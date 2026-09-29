import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <header className="relative min-h-screen bg-ornament text-slate-800 flex flex-col items-center justify-center text-center p-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#AEAEAE]/0  to-white/95"></div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 1 }}
                className="relative z-10 max-w-2xl mx-auto space-y-6 text-white"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-400/40 text-cyan-200 text-xs tracking-widest uppercase">
                    <img src="/maulid/logo.png" alt="ADM" className="w-12 h-auto" />
                    MT. AL-Ukhuwwah Daarul Mushthofa
                </div>

                {/* <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-cyan-400 to-teal-500 block mb-1">Ahlan Wa Sahlan</span>
                    Peringatan Maulid Nabi Muhammad SAW 1448 H
                </h1>

                <p className="text-sm md:text-base text-slate-200 font-light max-w-lg mx-auto">
                    "Sesungguhnya telah ada pada (diri) Rasulullah itu suri teladan yang baik bagimu..." (QS. Al-Ahzab: 21)
                </p> */}
                <div className="my-4 flex justify-center">
                    <img
                        src="/maulid/dekorasi/header.png"
                        alt="Maulid Akbar"
                        className="w-full max-w-lg mx-auto drop-shadow-[0_5px_15px_rgba(225,225,225,225.8)] brightness-125 filter"
                    />
                </div>

                <div className="pt-6">
                    <a href="#acara" className="inline-flex items-center gap-2 text-cyan-300 text-sm font-semibold tracking-wide hover:underline">
                        <span>Gulir ke bawah</span>
                        <span>↓</span>
                    </a>
                </div>
            </motion.div>
        </header>
    );
}