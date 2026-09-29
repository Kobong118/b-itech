import { motion } from 'framer-motion';

export default function FooterSection() {
    return (
        <footer className="bg-slate-900 text-white py-12 px-6 text-center border-t border-cyan-500/20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false}}
                transition={{ duration: 0.6 }}
                className="max-w-md mx-auto space-y-4"
            >
                <span className="font-serif text-2xl text-cyan-300 block">صلوا على النبي</span>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk bersama-sama memperingati Maulid Nabi Muhammad SAW.
                </p>
            </motion.div>
        </footer>
    );
}