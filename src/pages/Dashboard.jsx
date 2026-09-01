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

const ANGKATAN_COLORS = ["#17225E", "#2540C9", "#8CA0F2", "#C4CFF7"];

function colorForAngkatan(idx) {
  return ANGKATAN_COLORS[idx % ANGKATAN_COLORS.length];
}

function rupiah(v) {
  return "Rp " + Number(v || 0).toLocaleString("id-ID");
}

function rupiahJuta(v) {
  const n = Number(v || 0) / 1000000;
  return (
    "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " Jt"
  );
}

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function MonthlyTooltip({ active, payload, label, angkatanList }) {
  if (!active || !payload || !payload.length) return null;

  const total = angkatanList.reduce(
    (sum, a) => sum + (payload.find((p) => p.dataKey === a)?.value || 0),
    0,
  );

  return (
    <div className="rounded-lg bg-white dark:bg-[#1C1E26] border border-zinc-200 dark:border-white/10 shadow-lg shadow-black/5 text-[11px] leading-tight px-3.5 py-2.5 pointer-events-none">
      <p className="font-semibold text-zinc-800 dark:text-white mb-1.5">
        {label}
      </p>
      {angkatanList.map((a, idx) => {
        const value = payload.find((p) => p.dataKey === a)?.value || 0;
        return (
          <p
            key={a}
            className="flex items-center justify-between gap-6 text-zinc-500 dark:text-zinc-400 mt-1 first:mt-0"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: colorForAngkatan(idx) }}
              />
              Angkatan {a}
            </span>
            <span className="font-semibold text-zinc-900 dark:text-white tabular-nums">
              {rupiah(value)}
            </span>
          </p>
        );
      })}
      <div className="flex items-center justify-between gap-6 text-zinc-500 dark:text-zinc-400 mt-1.5 pt-1.5 border-t border-zinc-100 dark:border-white/10">
        <span>Total</span>
        <span className="font-semibold text-[#0E9F6E] tabular-nums">
          {rupiah(total)}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { summary } = useDashboard();

  return (
    <div
      className="h-[calc(100vh-82px)] flex flex-col gap-4 overflow-hidden pb-2"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Mini Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Tagihan"
          value={rupiah(summary.totalTagihan)}
          icon={HiBanknotes}
          color="#2540C9"
        />
        <StatCard
          title="Total Uang Masuk"
          value={rupiah(summary.totalDibayar)}
          icon={HiCreditCard}
          color="#0E9F6E"
        />
        <StatCard
          title="Sisa Tagihan"
          value={rupiah(summary.totalTunggakan)}
          icon={HiExclamationTriangle}
          color="#C6362A"
        />
        <StatCard
          title="Total Siswa"
          value={summary.totalSiswa}
          icon={HiUsers}
          color="#B5791E"
        />
      </div>

      {/* Main */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        {/* LEFT */}
        <div className="col-span-8 flex flex-col gap-4 min-h-0">
          {/* Grafik */}
          <div className="flex-[3] min-h-0 rounded-xl bg-white dark:bg-[#181A20] border border-zinc-200/80 dark:border-white/10 p-5 flex flex-col">
            <div className="flex justify-between items-start mb-4 shrink-0">
              <div>
                <h3 className="font-display font-semibold text-[15px] text-zinc-900 dark:text-white">
                  Laporan Bulanan Uang Masuk
                </h3>
                <div className="flex items-center gap-4 mt-2 text-[12px] text-zinc-500 dark:text-zinc-400 flex-wrap">
                  {summary.angkatanList.length === 0 ? (
                    <span>Juli - Juni</span>
                  ) : (
                    summary.angkatanList.map((a, idx) => (
                      <span key={a} className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colorForAngkatan(idx) }}
                        />
                        Angkatan {a}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <span className="text-[12px] px-2.5 py-1 rounded-md bg-[#0E9F6E1A] text-[#0E9F6E] font-semibold shrink-0">
                +{summary.collectionRate}%
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.monthlyChart} barSize={20}>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#E5E7EF"
                    opacity={0.7}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#9AA0B4" }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(37,64,201,0.05)" }}
                    content={
                      <MonthlyTooltip angkatanList={summary.angkatanList} />
                    }
                  />
                  {summary.angkatanList.map((a, idx) => (
                    <Bar
                      key={a}
                      dataKey={a}
                      name={`Angkatan ${a}`}
                      stackId="a"
                      fill={colorForAngkatan(idx)}
                      radius={
                        idx === summary.angkatanList.length - 1
                          ? [4, 4, 0, 0]
                          : idx === 0
                            ? [0, 0, 4, 4]
                            : [0, 0, 0, 0]
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaksi Terbaru */}
          <div className="flex-[2] min-h-0 rounded-xl bg-white dark:bg-[#181A20] border border-zinc-200/80 dark:border-white/10 p-5 flex flex-col">
            <h3 className="font-display font-semibold text-[15px] text-zinc-900 dark:text-white mb-1 shrink-0">
              Transaksi Terbaru
            </h3>
            <div className="custom-scroll flex-1 min-h-0 overflow-y-auto pr-1">
              {summary.recentPayments.length === 0 ? (
                <p className="text-[13px] text-zinc-400 pt-3">
                  Belum ada transaksi.
                </p>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-white/5">
                  {summary.recentPayments.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 py-2.5"
                    >
                      <div className="w-8 h-8 shrink-0 rounded-full bg-[#2540C90D] text-[#2540C9] flex items-center justify-center text-[11px] font-semibold">
                        {initials(item.nama)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-zinc-800 dark:text-white truncate">
                          {item.nama}
                        </p>
                        <p className="text-[12px] text-zinc-400">{item.nis}</p>
                      </div>
                      <span className="text-[13px] font-semibold text-[#0E9F6E] tabular-nums shrink-0">
                        {rupiah(item.nominal)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Item Tagihan per Jurusan */}
        <div className="col-span-4 min-h-0 rounded-xl bg-white dark:bg-[#181A20] border border-zinc-200/80 dark:border-white/10 p-5 flex flex-col">
          <div className="flex justify-between items-baseline mb-4 shrink-0">
            <h3 className="font-display font-semibold text-[15px] text-zinc-900 dark:text-white">
              Total Tagihan
            </h3>
            <span className="text-[12px] text-zinc-400">per Jurusan</span>
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
                  className="rounded-lg border border-zinc-100 dark:border-white/5 p-3.5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-medium text-zinc-800 dark:text-white truncate">
                      {j.name}
                    </span>
                    <span className="text-[12px] font-semibold text-[#2540C9] shrink-0">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-white/10 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-[#2540C9] transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-zinc-400">
                    <span>
                      Total:{" "}
                      <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                        {rupiahJuta(j.Tagihan)}
                      </span>
                    </span>
                    <span>
                      Masuk:{" "}
                      <span className="text-[#0E9F6E] font-medium">
                        {rupiahJuta(j.Dibayar)}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Font & scrollbar */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .font-display {
          font-family: 'Manrope', 'Inter', system-ui, sans-serif;
          letter-spacing: -0.01em;
        }

        .custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(113, 113, 122, 0.35) transparent;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(113, 113, 122, 0.3);
          border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(113, 113, 122, 0.55);
        }
        .dark .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(212, 212, 216, 0.2);
        }
        .dark .custom-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(212, 212, 216, 0.4);
        }
      `}</style>
    </div>
  );
}
