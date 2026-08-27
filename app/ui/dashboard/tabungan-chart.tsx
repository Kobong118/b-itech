import { lusitana } from '@/app/ui/fonts';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { getMonthlyTabungan } from '@/app/lib/supabaseQuery';

export default async function TabunganChart() {
  const chartHeight = 350;

  // LOGIKA ASLI ANDA (Tidak diubah sama sekali)
  const data = await getMonthlyTabungan();
  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  const formatYAxis = (val: number) => {
    if (val >= 1000000) return `Rp${Math.round(val / 1000000)}jt`;
    if (val >= 1000) return `Rp${Math.round(val / 1000)}rb`;
    return `Rp${val}`;
  };

  if (!data || data.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Grafik Tabungan Terbaru
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          {/* Y-Axis Labels (Menggunakan kalkulasi logika maxTotal Anda) */}
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            <p>{formatYAxis(maxTotal)}</p>
            <p>{formatYAxis(maxTotal * 0.75)}</p>
            <p>{formatYAxis(maxTotal * 0.5)}</p>
            <p>{formatYAxis(maxTotal * 0.25)}</p>
            <p>Rp0</p>
          </div>

          {/* Bar Chart Bars (Menggunakan proporsi tinggi persentase dari maxTotal Anda) */}
          {data.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(month.total / maxTotal) * chartHeight}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {month.month}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">12 bulan terakhir</h3>
        </div>
      </div>
    </div>
  );
}