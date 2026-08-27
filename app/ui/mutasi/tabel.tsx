import Image from 'next/image';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredTabungan } from '@/app/lib/supabaseQuery';
import TabunganMobileCard from '@/app/ui/mutasi/tabunganMobileCard';

export default async function MutasiTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const tabungan = await fetchFilteredTabungan(query, currentPage);
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {tabungan.map((item) => (
                            <TabunganMobileCard key={item.id} item={item} />
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Jamaah
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Setor
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Tarik
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Keterangan
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Tanggal
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {tabungan?.map((item) => {
                                // 1. Logika Avatar Dinamis berdasarkan jenis_kelamin
                                const gender = item.jenis_kelamin?.toLowerCase() || '';
                                const isLaki = gender.includes('laki') || gender.includes('pria') || gender.includes('male');
                                const avatarSrc = isLaki ? '/jamaah/akhi.jpg' : '/jamaah/ukhti.jpg';

                                // 2. Logika Setor: Pilih yang tidak null / 0 (setor_tunai atau setor_e_walet)
                                const setorValue = Number(item.setor_tunai || 0) > 0
                                    ? item.setor_tunai
                                    : item.setor_e_walet || 0;

                                // 3. Logika Tarik: Pilih yang tidak null / 0 (tarik_tunai atau tarik_e_walet)
                                const tarikValue = Number(item.tarik_tunai || 0) > 0
                                    ? item.tarik_tunai
                                    : item.tarik_e_walet || 0;

                                // 4. Logika Keterangan: Pilih yang tidak null / string kosong
                                const keteranganText = item.keterangan || item.ket_e_walet || '-';

                                return (
                                    <tr
                                        key={item.id}
                                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                    >
                                        {/* Kolom Jamaah (Avatar + Nama) */}
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={avatarSrc}
                                                    className="rounded-full object-cover"
                                                    width={28}
                                                    height={28}
                                                    style={{ width: 'auto', height: 'auto' }}
                                                    alt={`${item.nama || 'Jamaah'}'s profile picture`}
                                                />
                                                <p className="font-medium">{item.nama || 'Tanpa Nama'}</p>
                                            </div>
                                        </td>

                                        {/* Kolom Setor */}
                                        <td className="whitespace-nowrap px-3 py-3 font-medium text-green-600">
                                            {Number(setorValue) > 0 ? formatCurrency(setorValue) : '-'}
                                        </td>

                                        {/* Kolom Tarik */}
                                        <td className="whitespace-nowrap px-3 py-3 font-medium text-red-600">
                                            {Number(tarikValue) > 0 ? formatCurrency(tarikValue) : '-'}
                                        </td>

                                        {/* Kolom Keterangan */}
                                        <td className="whitespace-nowrap px-3 py-3 text-gray-500">
                                            {keteranganText}
                                        </td>

                                        {/* Kolom Tanggal */}
                                        <td className="whitespace-nowrap px-3 py-3 text-gray-500">
                                            {item.update_at ? formatDateToLocal(item.update_at) : '-'}
                                        </td>

                                        {/* Kolom Action (Update & Delete) */}
                                        {/* <td className="whitespace-nowrap py-3 pl-3 pr-6">
                                            <div className="flex justify-end gap-3">
                                                <UpdateTabungan id={item.id} />
                                                <DeleteTabungan id={item.id} />
                                            </div>
                                        </td> */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}