'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
// module supaya tidak melakukan query ke database setiap kali menekan tombol
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    // ketika pengguna mengetikkan kueri pencarian baru, Anda ingin mengatur ulang nomor halaman menjadi 1.
    params.set('page', '1');
    // set string params berdasarkan input pengguna
    if (term) {
      params.set('query', term);
    }
    else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300); // Debounce for 300ms

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        // Untuk memastikan kolom input sinkron dengan URL dan akan terisi saat dibagikan, Anda dapat meneruskan nilai defaultValueke input dengan membaca dari searchParams
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
