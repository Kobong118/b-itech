import { ImageResponse } from 'next/og';

// Menentukan tipe data parameter URL
interface ImageProps {
  params: {};
  searchParams: { to?: string };
}

// Konfigurasi ukuran gambar standar Open Graph (WhatsApp/FB/Twitter)
export const alt = 'Undangan Resmi Maulid Nabi SAW 1448 H';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Fungsi helper untuk merapikan nama tamu
function formatGuestName(slug: string): string {
  return decodeURIComponent(slug)
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function Image({ searchParams }: ImageProps) {
  // Ambil nama tamu dari query parameter (?to=nama-tamu)
  const guestName = searchParams?.to ? formatGuestName(searchParams.to) : 'Tamu Undangan';

  return new ImageResponse(
    (
      // Konten HTML/CSS yang akan di-render menjadi Gambar PNG
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f2c1d', // Warna dasar hijau islami
          backgroundImage: 'radial-gradient(circle, #16402b 0%, #0a1f14 100%)',
          padding: '40px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Dekorasi Aksen Islami / Ornamen Ringan */}
        <div style={{ display: 'flex', fontSize: '32px', marginBottom: '10px' }}>🌙 ⭐</div>

        {/* Judul Acara */}
        <div
          style={{
            fontSize: '36px',
            fontWeight: 'normal',
            color: '#d4af37', // Warna emas/gold
            letterSpacing: '2px',
            marginBottom: '10px',
          }}
        >
          UNDANGAN RESMI
        </div>
        
        <div
          style={{
            fontSize: '54px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '50px',
            textAlign: 'center',
          }}
        >
          MAULID NABI NABI SAW 1448 H
        </div>

        {/* Kotak Nama Tamu */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid #d4af37',
            borderRadius: '16px',
            padding: '40px 60px',
            maxWidth: '85%',
          }}
        >
          <div style={{ fontSize: '24px', color: '#a0aec0', marginBottom: '10px' }}>
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#d4af37',
              textAlign: 'center',
            }}
          >
            {guestName}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '20px',
            color: '#718096',
          }}
        >
          MT. Al-Ukhuwwah Daarul Mushthofa • B-Itech
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
