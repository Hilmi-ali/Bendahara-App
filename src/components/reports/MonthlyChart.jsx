import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
} from "recharts";

export default function MonthlyChart({ data }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-darkcard shadow border p-5 h-80">
      <h3 className="font-semibold mb-4">Pembayaran Bulanan</h3>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="monthFill">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

          <XAxis dataKey="bulan" />

          <Tooltip />

          <Area
            dataKey="total"
            stroke="#2563eb"
            fill="url(#monthFill)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
