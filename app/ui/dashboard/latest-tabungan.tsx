import { lusitana } from '@/app/ui/fonts';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { fetchLatestTabungan } from '@/app/lib/supabaseQuery';

export default async function LatestTabungan() {
  const latestTabungan = await fetchLatestTabungan();

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
              className={`flex flex-row items-center justify-between py-4 ${
                i !== 0 ? 'border-t' : ''
              }`}
            >
              <div className="flex items-center min-w-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold md:text-base">
                    {item.nama}
                  </p>
                  <p className="hidden text-sm text-gray-500 sm:block">
                   Nomor registrasi: {item.rek}
                  </p>
                </div>
              </div>
              <p
                className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
              >
                {item.amount}
              </p>
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