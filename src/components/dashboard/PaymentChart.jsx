import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function PaymentDonut({ summary }) {
  return (
    <div className="rounded-3xl bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl border border-white/20 shadow-xl p-5">
      <h3 className="font-bold mb-5 dark:text-white">Payment Distribution</h3>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={summary.donut}
            dataKey="value"
            innerRadius={55}
            outerRadius={80}
          >
            <Cell fill="#22c55e" />

            <Cell fill="#ef4444" />
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
