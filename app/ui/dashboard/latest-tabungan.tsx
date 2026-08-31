import { lusitana } from '@/app/ui/fonts';
import { ArrowPathIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { fetchLatestTabungan } from '@/app/lib/supabaseQuery';
import Image from 'next/image';

export default async function LatestTabungan() {
  const latestTabungan = await fetchLatestTabungan();
   // 1. Logika Avatar Dinamis berdasarkan jenis_kelamin
  const gender = latestTabungan[0]?.jenis_kelamin?.toLowerCase() || '';
  const isLaki = gender.includes('laki') || gender.includes('pria') || gender.includes('male');
  const avatarSrc = isLaki ? '/jamaah/akhi.jpg' : '/jamaah/ukhti.jpg';

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Penabung Terbaru
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestTabungan.map((item, i) => (
            <div
              key={item.id}
              className={`flex flex-row items-center justify-between py-4 ${i !== 0 ? 'border-t' : ''
                }`}
            >
              <div className="flex items-center min-w-0">
                <div className="min-w-0 flex items-center">                  
                  <Image
                    src={avatarSrc}
                    className="mr-2 rounded-full object-cover"
                    width={28}
                    height={28}
                    style={{ width: 'auto', height: 'auto' }}
                    alt={`${item.nama || 'Jamaah'}'s profile picture`}
                  />
                  <div className="flex flex-col min-w-0">
                   <p className="truncate text-sm font-semibold md:text-base">
                     {item.nama}
                   </p>
                    <p className="text-sm text-gray-500">
                   Total Tabungan: {item.amount}
                   </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center">                
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {item.lastSetor !== '0' ? item.lastSetor : item.lastTarik}
                </p>
                {item.lastSetor !== '0' ? (
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Baru saja diperbarui</h3>
        </div>
      </div>
    </div>
  );
}