import InvitationClient from '@/app/undangan/komponen/invitationClient'
import { getComments, addGuestbookEntry, addHadiahConfirmation,getGiftConfirmations } from '@/app/lib/supabaseQuery'
import type { Metadata } from 'next';

const URL_DOMAIN = 'https://b-itech.vercel.app'; // 👈 Sesuaikan dengan domain Vercel Anda

// Konfigurasi Open Graph untuk pratinjau media sosial khusus halaman undangan
export const metadata: Metadata = {
  title: 'Undangan Maulid Nabi SAW 1448 H',
  description: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.',
  openGraph: {
    title: 'Undangan Maulid Nabi SAW 1448 H',
    description: 'Silakan buka tautan ini untuk melihat detail acara.',
    url: 'https://b-itech.vercel.app/undangan/maulid-1448', // Sesuaikan dengan domain Anda
    siteName: 'B-Itech',
    images: [
      {
        url: `${URL_DOMAIN}/maulid/thumbnail.jpeg`, // Pastikan gambar ada di folder public/images/
        width: 1200,
        height: "auto",
        alt: 'Thumbnail Undangan Maulid Nabi',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Undangan Maulid Nabi SAW 1448 H',
    description: 'Silakan buka tautan ini untuk melihat detail acara.',
    images: [`${URL_DOMAIN}/maulid/thumbnail.jpeg`],
  },
};

interface PageProps {
  searchParams: Promise<{ to?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  // Unwrapping searchParams menggunakan await
  const resolvedParams = await searchParams
  const guestName = resolvedParams?.to ? decodeURIComponent(resolvedParams.to) : 'Tamu Undangan'
  
  const comments = await getComments()
  // Ambil data konfirmasi hadiah menggunakan fungsi server yang sudah dipisah
const giftsData = await getGiftConfirmations();

  return (
    <main className="min-h-screen bg-[#EAEAEA]">
      <InvitationClient 
        guestName={guestName} 
        initialComments={comments.map((comment) => ({
          ...comment,
          name: comment.name ?? 'Anonim',
          status: comment.status ?? 'pending',
        }))} 
        addGuestbookEntry={addGuestbookEntry} 
        addHadiahConfirmation={addHadiahConfirmation}
        initialGifts={giftsData || []}
      />
    </main>
  )
}