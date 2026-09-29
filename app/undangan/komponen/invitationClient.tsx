'use client'

import { useState, useRef } from 'react';
import CoverSection from '@/app/undangan/komponen/CoverSection';
import HeroSection from '@/app/undangan/komponen/HeroSection';
import AyatSection from '@/app/undangan/komponen/AyatSection';
import EventDetailSection from '@/app/undangan/komponen/EventDetailSection';
import GuestBookSection from '@/app/undangan/komponen/GuestBookSection';
import FooterSection from '@/app/undangan/komponen/FooterSection';
import PenceramahSection from '@/app/undangan/komponen/PenceramahSection';
import KirimHadiahSection from '@/app/undangan/komponen/KirimHadiahSection';
import GiftListSection from "@/app/undangan/komponen/GiftListSection"; // 👈 Import komponen list hadiah


export default function InvitationClient({ guestName, initialComments, addGuestbookEntry, addHadiahConfirmation,initialGifts }: any) {
    const [isOpened, setIsOpened] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleOpenInvitation = () => {
        setIsOpened(true);
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                setIsAudioPlaying(true);
            }).catch((err) => console.log("Audio play blocked:", err));
        }
    };

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isAudioPlaying) {
            audioRef.current.pause();
            setIsAudioPlaying(false);
        } else {
            audioRef.current.play();
            setIsAudioPlaying(true);
        }
    };

    return (
        <main className="relative min-h-screen bg-[#AEAEAE] text-slate-800 overflow-x-hidden">
            
            {/* 1. COVER / HALAMAN PEMBUKA */}
            <CoverSection 
                isOpened={isOpened} 
                guestName={guestName} 
                handleOpenInvitation={handleOpenInvitation} 
            />

            {/* AUDIO BACKGROUND CONTROLLER */}
            <div className={`fixed bottom-6 right-6 z-40 ${isOpened ? 'block' : 'hidden'}`}>
                <button 
                    onClick={toggleAudio} 
                    className="w-12 h-12 bg-slate-800 border-2 border-cyan-500 rounded-full flex items-center justify-center text-cyan-400 shadow-xl hover:bg-slate-700 transition-all duration-300 cursor-pointer"
                >
                    <span className={isAudioPlaying ? "animate-spin" : ""}>{isAudioPlaying ? "🎵" : "🔇"}</span>
                </button>
                <audio ref={audioRef} loop>
                    <source src="/music/laitakamaana.mp3" type="audio/mpeg" />
                </audio>
            </div>

            {/* 2. MAIN HERO CONTENT */}
            <HeroSection />

            {/* 3. AYAT SECTION */}
            <AyatSection />

            {/* 4. DETAIL ACARA */}
            <EventDetailSection />

            {/* 5. PENCERAMAH */}
            <PenceramahSection />

            {/* 6. KIRIM HADIAH */}
            <KirimHadiahSection 
            guestName={guestName}
            addHadiahConfirmation={addHadiahConfirmation}
            />

            {/* Section Gifts Render List */}
            <GiftListSection gifts={initialGifts || []} />

            {/* 7. RSVP & BUKU TAMU */}
            <GuestBookSection 
                initialComments={initialComments} 
                addGuestbookEntry={addGuestbookEntry} 
                guestName={guestName}
            />

            {/* 8. FOOTER */}
            <FooterSection />

        </main>
    );
}