import {
  HiBanknotes,
  HiCreditCard,
  HiExclamationTriangle,
  HiUsers,
} from "react-icons/hi2";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../components/ui/StatCard";
import useDashboard from "../hooks/useDashboard";

function rupiah(v) {
  return "Rp " + Number(v || 0).toLocaleString("id-ID");
}

function rupiahJuta(v) {
  const n = Number(v || 0) / 1000000;
  return (
    "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " Jt"
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const dibayar = payload.find((p) => p.dataKey === "Dibayar")?.value || 0;
  const sisa = payload.find((p) => p.dataKey === "Sisa")?.value || 0;
  return (
    <div className="rounded-lg bg-zinc-900/95 text-white text-[11px] leading-tight px-3 py-2 shadow-lg pointer-events-none">
      <p className="font-semibold mb-1">{label}</p>
      <p className="flex justify-between gap-4">
        <span className="text-zinc-400">Dibayar</span>
        <span className="font-semibold">{rupiah(dibayar)}</span>
      </p>
      <p className="flex justify-between gap-4">
        <span className="text-zinc-400">Sisa</span>
        <span className="font-semibold text-rose-300">{rupiah(sisa)}</span>
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { summary } = useDashboard();

  const chartData = summary.jurusanChart.map((j) => ({
    name: j.name,
    Dibayar: j.Dibayar,
    Sisa: Math.max((j.Tagihan || 0) - (j.Dibayar || 0), 0),
  }));

  return (
    <div className="h-[calc(100vh-82px)] flex flex-col gap-4 overflow-hidden pb-2">
      {/* Mini Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Tagihan"
          value={rupiah(summary.totalTagihan)}
          icon={HiBanknotes}
          color="bg-indigo-500"
        />
        <StatCard
          title="Total Uang Masuk"
          value={rupiah(summary.totalDibayar)}
          icon={HiCreditCard}
          color="bg-emerald-500"
        />
        <StatCard
          title="Sisa Tagihan"
          value={rupiah(summary.totalTunggakan)}
          icon={HiExclamationTriangle}
          color="bg-rose-500"
        />
        <StatCard
          title="Total Siswa"
          value={summary.totalSiswa}
          icon={HiUsers}
          color="bg-amber-500"
        />
      </div>

      {/* Main */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        {/* LEFT */}
        <div className="col-span-8 flex flex-col gap-4 min-h-0">
          {/* Grafik */}
          <div className="flex-[3] min-h-0 rounded-2xl bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl shadow-xl border border-white/20 p-5 flex flex-col">
            <div className="flex justify-between items-center mb-2 shrink-0">
              <h3 className="font-bold text-lg dark:text-white">
                Laporan Tagihan per Jurusan
              </h3>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">
                +{summary.collectionRate}%
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={26}>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="4 4"
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={<ChartTooltip />}
                  />
                  <Bar
                    dataKey="Dibayar"
                    stackId="a"
                    fill="#18181b"
                    radius={[0, 0, 6, 6]}
                    activeBar={{ fill: "#18181b" }}
                  />
                  <Bar
                    dataKey="Sisa"
                    stackId="a"
                    fill="#d4d4d8"
                    radius={[6, 6, 0, 0]}
                    activeBar={{ fill: "#d4d4d8" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaksi Terbaru */}
          <div className="flex-[2] min-h-0 rounded-2xl bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl shadow-xl border border-white/20 p-5 flex flex-col">
            <h3 className="font-bold text-lg mb-2 dark:text-white shrink-0">
              Transaksi Terbaru
            </h3>
            <div className="custom-scroll flex-1 min-h-0 overflow-y-auto pr-1">
              {summary.recentPayments.length === 0 ? (
                <p className="text-sm text-gray-400">Belum ada transaksi.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 text-xs">
                      <th className="pb-2 font-medium">Nama</th>
                      <th className="pb-2 font-medium">NIS</th>
                      <th className="pb-2 font-medium text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.recentPayments.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-zinc-100 dark:border-zinc-700"
                      >
                        <td className="py-2 font-semibold dark:text-white">
                          {item.nama}
                        </td>
                        <td className="py-2 text-gray-500">{item.nis}</td>
                        <td className="py-2 text-right font-bold text-emerald-600">
                          {rupiah(item.nominal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Item Tagihan */}
        <div className="col-span-4 min-h-0 rounded-2xl bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl shadow-xl border border-white/20 p-5 flex flex-col">
          <div className="flex justify-between items-center mb-3 shrink-0">
            <h3 className="font-bold text-lg dark:text-white">Item Tagihan</h3>
            <span className="text-xs text-gray-400">per Jurusan</span>
          </div>
          <div className="custom-scroll flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
            {summary.jurusanChart.map((j) => {
              const pct =
                !j.Tagihan || j.Tagihan === 0
                  ? 0
                  : Math.round((j.Dibayar / j.Tagihan) * 100);
              return (
                <div
                  key={j.name}
                  className="rounded-xl bg-zinc-50 dark:bg-zinc-800 p-3"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-semibold dark:text-white truncate">
                      {j.name}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 shrink-0">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden mb-1.5">
                    <div
                      className="h-full rounded-full bg-zinc-900 dark:bg-white transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    Uang Masuk: {rupiahJuta(j.Dibayar)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollbar modern (menggantikan scrollbar bawaan browser) */}
      <style>{`
        .custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(113, 113, 122, 0.4) transparent;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(113, 113, 122, 0.35);
          border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(113, 113, 122, 0.6);
        }
        .dark .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(212, 212, 216, 0.25);
        }
        .dark .custom-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(212, 212, 216, 0.45);
        }
      `}</style>
    </div>
  );
}
