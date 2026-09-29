import type { Metadata } from 'next';

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
        url: '/maulid/thumbnail.webp', // Pastikan gambar ada di folder public/images/
        width: 1200,
        height: 630,
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
    images: ['/maulid/thumbnail.webp'],
  },
};

export default function UndanganLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cukup kembalikan children agar otomatis masuk ke layout root utama
  return <>{children}</>;
}