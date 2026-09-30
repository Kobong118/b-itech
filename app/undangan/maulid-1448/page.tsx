import InvitationClient from '@/app/undangan/komponen/invitationClient'
import { getComments, addGuestbookEntry, addHadiahConfirmation,getGiftConfirmations } from '@/app/lib/supabaseQuery'
import type { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{ to?: string }>
}
const URL_DOMAIN = 'https://b-itech.vercel.app'; // 👈 Sesuaikan dengan domain Vercel Anda


// 1. Fungsi Helper untuk merapikan format nama tamu dari URL (Contoh: "budi-utomo" -> "Budi Utomo")
function formatGuestName(slug: string): string {
  return decodeURIComponent(slug)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// 2. Mengubah Metadata Statis Menjadi Dinamis dengan generateMetadata


export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const guestName = resolvedParams?.to ? formatGuestName(resolvedParams.to) : 'Tamu Undangan';

  const currentUrl = resolvedParams?.to 
    ? `${URL_DOMAIN}/undangan/maulid-1448?to=${encodeURIComponent(resolvedParams.to)}` 
    : `${URL_DOMAIN}/undangan/maulid-1448`;

  const imageUrl = `${URL_DOMAIN}/maulid/thumnail.jpeg`;

  return {
    // 🛠️ PENTING: metadataBase wajib ada agar Next.js memetakan URL relatif/absolut dengan benar
    metadataBase: new URL(URL_DOMAIN),
    
    title: `Undangan Maulid Nabi Muhammad SAW 1448 H - ${guestName}`,
    description: `Kepada Yth. Bapak/Ibu/Saudara/i: ${guestName}. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir.`,
    
    // Format OpenGraph (Digunakan oleh Facebook, WhatsApp, LinkedIn, dan dioptimalkan untuk Instagram Crawler)
    openGraph: {
      title: `Undangan Maulid Nabi Muhammad SAW 1448 H`,
      description: `Kepada Yth. ${guestName} - Silakan buka tautan ini untuk melihat detail acara.`,
      url: currentUrl,
      siteName: 'B-Itech',
      locale: 'id_ID',
      type: 'website',
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl, // 🛡️ Tambahan keamanan untuk crawler HTTPS
          width: 1200,
          height: 630,
          alt: `Undangan Maulid Nabi Muhammad SAW 1448 H - ${guestName}`,
          type: 'image/jpeg',
        },
      ],
    },

    // Format Twitter Card (Digunakan juga oleh beberapa bot platform lain yang membaca card preview)
    twitter: {
      card: 'summary_large_image',
      title: `Undangan Maulid Nabi Muhammad SAW 1448 H - ${guestName}`,
      description: `Kepada Yth. ${guestName} - Silakan buka tautan ini untuk melihat detail acara.`,
      images: [imageUrl],
    },
  };
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