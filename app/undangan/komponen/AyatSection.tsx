import { motion } from 'framer-motion';
import { amiri } from '@/app/ui/fonts';

export default function AyatSection() {
    return (
        <section className="relative py-20 px-6 bg-ornament text-slate-800 text-center overflow-hidden">
            {/* Gradient Overlay agar menyatu dengan nuansa Hero */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/100 via-[#AEAEAE]/50 to-[#AEAEAE]/90"></div>

            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-3xl mx-auto bg-slate-900/80 border border-cyan-400/40 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-md"
            >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cyan-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow">
                    Surat Undangan
                </div>
                
                <p className={`font-serif text-2xl md:text-3xl text-cyan-300 leading-relaxed mb-6 mt-2 drop-shadow ${amiri.className}`} dir="rtl">
                   بسم الله الرحمن الرحيم<br />
      السلام عليكم ورحمة الله وبركاته
                </p>

                {/* <h3 className="font-serif text-lg md:text-xl font-semibold mb-3 text-slate-100">
                    Surah Al-Anbiya Ayat 107
                </h3> */}

                <p className="text-sm md:text-base text-slate-200 italic font-light leading-relaxed">
                    Puji syukur kepada Alloh SWT atas segala limpahan rahmatNya kepada kita semua baik berupa kesehatan maupun keberkahan.<br/><br/>
        Sholawat dan salam juga tak lupa kita panjatkan kepada Junjungan Nabi Besar Muhammad SAW, kepada keluarganya para sahabatnya sampai kepada kita semua sebagai umatnya hingga hari kiamat.
        Dalam rangka memperingati Maulid Nabi Muhammad SAW, Kami akan menyelenggarakan acara Tabligh Akbar.<br/><br/> Maka dengan rasa hurmat kami mengundang Bapak/Ibu untuk ikut berpatisipasi dalam acara tersebut.
        Demikian undangan dari kami Besar harapan kami Bapak/Ibu Jama'ah bisa berkenan hadir pada waktunya.<br/><br/> Atas
        perhatian dan kerjasamanya kami atas nama Panitia mengucapkan <br/>
        terimakasih
                </p>
                <p className={`text-2xl md:text-3xl text-cyan-300 leading-relaxed mb-6 mt-2 drop-shadow ${amiri.className}`} dir="rtl">
                    والسلام عليكم ورحمة الله وبركاته
                </p>
            </motion.div>
        </section>
    );
}