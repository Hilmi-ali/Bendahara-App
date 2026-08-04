import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
} from "recharts";

export default function JurusanBarChart({ data }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-darkcard shadow border p-5 h-80">
      <h3 className="font-semibold mb-4">Pembayaran per Jurusan</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

          <XAxis dataKey="jurusan" />

          <Tooltip />

          <Bar dataKey="dibayar" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
