import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: 'B-Itech | %s',
    default: 'B-Itech',
  },
  description: 'Aplikasi web Tour ADM & IT Al-Ukhuwwah Daarul Mushthofa.',
  metadataBase: new URL('https://b-itech.vercel.app'),
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}