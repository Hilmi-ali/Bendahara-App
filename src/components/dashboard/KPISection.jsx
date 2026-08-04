import {
  HiUsers,
  HiBanknotes,
  HiCreditCard,
  HiExclamationTriangle,
} from "react-icons/hi2";

import StatCard from "../ui/StatCard";

export default function KPISection({ summary, rupiah }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Siswa" value={summary.totalSiswa} icon={HiUsers} />

      <StatCard
        title="Tagihan"
        value={rupiah(summary.totalTagihan)}
        icon={HiBanknotes}
        color="bg-blue-600"
      />

      <StatCard
        title="Pembayaran"
        value={rupiah(summary.totalDibayar)}
        icon={HiCreditCard}
        color="bg-green-600"
      />

      <StatCard
        title="Menunggak"
        value={summary.siswaNunggak}
        icon={HiExclamationTriangle}
        color="bg-red-500"
      />
    </div>
  );
}
