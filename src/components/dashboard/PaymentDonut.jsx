import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function PaymentDonut({ dibayar, tunggakan }) {
  const data = [
    {
      name: "Lunas",
      value: dibayar,
    },
    {
      name: "Tunggakan",
      value: tunggakan,
    },
  ];

  return (
    <div className="rounded-3xl bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl shadow-lg p-6">
      <h3 className="font-bold mb-3 dark:text-white">Payment Ratio</h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90}>
            <Cell fill="#22c55e" />
            <Cell fill="#ef4444" />
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
