import Image from 'next/image';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';

export default function TabunganMobileCard({ item }: { item: any }) {
  // 1. Logika Avatar Dinamis berdasarkan jenis_kelamin
  const gender = item.jenis_kelamin?.toLowerCase() || '';
  const isLaki = gender.includes('laki') || gender.includes('pria') || gender.includes('male');
  const avatarSrc = isLaki ? '/jamaah/akhi.jpg' : '/jamaah/ukhti.jpg';

  // 2. Logika Setor: Pilih yang tidak null / 0
  const setor = Number(item.setor_tunai || 0) > 0 
    ? item.setor_tunai 
    : item.setor_e_walet || 0;

  // 3. Logika Tarik: Pilih yang tidak null / 0
  const tarik = Number(item.tarik_tunai || 0) > 0 
    ? item.tarik_tunai 
    : item.tarik_e_walet || 0;

  // 4. Logika Keterangan: Pilih yang tidak null / 0
  const keterangan = item.keterangan || item.ket_e_walet || '-';

  return (
    <div
      key={item.id}
      className="mb-2 w-full rounded-md bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <div className="mb-2 flex items-center">
            {/* Image Profile Dinamis */}
            <Image
              src={avatarSrc}
              className="mr-2 rounded-full object-cover"
              width={28}
              height={28}
              style={{ width: 'auto', height: 'auto' }}
              alt={`${item.nama || 'Jamaah'}'s profile picture`}
            />
            <p className="font-semibold text-gray-900">{item.nama || 'Tanpa Nama'}</p>
          </div>
          <p className="text-sm text-gray-500">Ket: {keterangan}</p>
        </div>

        {/* Status Transaksi: Setor (+) atau Tarik (-) */}
        <div>
          {Number(setor) > 0 && (
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
              Setor
            </span>
          )}
          {Number(tarik) > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
              Tarik
            </span>
          )}
        </div>
      </div>

      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <p className="text-xl font-medium">
            {Number(setor) > 0 
              ? `+ ${formatCurrency(setor)}` 
              : Number(tarik) > 0 
              ? `- ${formatCurrency(tarik)}` 
              : 'Rp 0'}
          </p>
          <p className="text-xs text-gray-400">
            {item.update_at ? formatDateToLocal(item.update_at) : '-'}
          </p>
        </div>

        {/* <div className="flex justify-end gap-2">
          <UpdateTabungan id={item.id} />
          <DeleteTabungan id={item.id} />
        </div> */}
      </div>
    </div>
  );
}