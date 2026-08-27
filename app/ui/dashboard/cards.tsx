import {
  BanknotesIcon,
  WalletIcon,
  UserGroupIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/supabaseQuery';

const iconMap = {
  cash: BanknotesIcon,
  jamaah: UserGroupIcon,
  ewalet: WalletIcon,
  penabung: CreditCardIcon,
};

export default async function CardWrapper() {
  const {
    numberOfJamaah,
    numberOfActivePenabung,
    totalEwalet,
    totalUangTunai,
  } = await fetchCardData();
  return (
    <>
      <Card title="Total Jamaah Tour ADM" value={numberOfJamaah} type="jamaah" />
      <Card title="Penabung Aktif" value={numberOfActivePenabung} type="penabung" />
      <Card title="Total E-Wallet" value={totalEwalet} type="ewalet" />
      <Card title="Total Uang Tunai" value={totalUangTunai} type="cash" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'jamaah' | 'penabung' | 'ewalet' | 'cash';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
