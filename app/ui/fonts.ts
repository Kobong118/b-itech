import { Inter, Lusitana, Amiri } from 'next/font/google';
 
export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'], // Menggunakan subset arabic agar huruf hijaiyah/arab terbaca sempurna
});