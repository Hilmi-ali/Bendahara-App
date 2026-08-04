import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
} from "recharts";

export default function JurusanChart({ data }) {
  return (
    <div className="rounded-3xl bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl shadow-lg p-6 h-full">
      <h3 className="font-bold mb-4 dark:text-white">Pembayaran per Jurusan</h3>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

          <XAxis dataKey="name" />

          <Tooltip />

          <Bar dataKey="Dibayar" radius={[8, 8, 0, 0]} />

          <Bar dataKey="Tagihan" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
