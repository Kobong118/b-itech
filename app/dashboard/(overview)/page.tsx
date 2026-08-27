
import  CardWrapper  from '@/app/ui/dashboard/cards';
import TabunganCard from '@/app/ui/dashboard/tabungan-chart';
import LatestTabungan from '@/app/ui/dashboard/latest-tabungan';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardSkeleton
} from '@/app/ui/skeletons';

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/*streaming komponen dengan suspen efek bertahap */}
        <Suspense fallback={<CardSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* streaming setiap komponen secara individual */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <TabunganCard />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestTabungan />
        </Suspense>
      </div>
    </main>
  );
}