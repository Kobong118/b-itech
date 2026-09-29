'import client directive if needed'
import { motion } from 'framer-motion';

interface CoverProps {
    isOpened: boolean;
    guestName: string;
    handleOpenInvitation: () => void;
}

export default function CoverSection({ isOpened, guestName, handleOpenInvitation }: CoverProps) {
    return (
        <div 
            id="cover-page" 
            className={`fixed inset-0 z-50 bg-[#AEAEAE] flex flex-col items-center justify-center p-4 text-slate-800 overflow-y-auto transition-all duration-1000 ${
                isOpened ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
            }`}
        >
            <div className="bg-ornament absolute inset-0 z-0"></div>

            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-md border border-cyan-700/30 rounded-2xl p-8 shadow-2xl text-center my-auto"
            >
                <div className="absolute top-3 left-3 text-cyan-600 text-lg">🌙</div>
                <div className="absolute top-3 right-3 text-cyan-600 text-lg">⭐</div>
                
                <span className="inline-block px-4 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs tracking-widest uppercase mb-4 font-semibold border border-cyan-200">
                    Peringatan Maulid Nabi SAW
                </span>
                <h1 className="font-serif text-3xl md:text-4xl text-slate-900 mb-2 font-bold leading-tight">
                    Rasulullah SAW Teladan Utama
                </h1>
                <p className="text-xs tracking-wider text-slate-500 mb-6 font-light">
                    12 Rabiul Awal 1448 Hijriyah
                </p>

                <div className="border-t border-b border-cyan-100 py-4 my-4">
                    <p className="text-xs text-slate-500 mb-1">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
                    <h2 className="font-serif text-xl font-bold text-slate-800 tracking-wide">{guestName}</h2>
                    <p className="text-[11px] text-cyan-700 mt-1 italic">(Mohon maaf bila ada kesalahan penulisan nama/gelar)</p>
                </div>

                <button 
                    onClick={handleOpenInvitation}
                    className="w-full mt-2 py-3 px-6 bg-gradient-to-r from-cyan-600 to-teal-700 text-white font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                    ✉️ Buka Undangan
                </button>
            </motion.div>

            <footer className="relative z-10 text-[10px] text-slate-700 font-medium mt-4">
                Created By NHA Studio • MT.Al-Ukhuwwah Daarul Mushthofa • 2026
            </footer>
        </div>
    );
}