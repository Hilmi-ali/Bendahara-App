function rupiah(v) {
  return "Rp " + Number(v).toLocaleString("id-ID");
}

export default function OutstandingCard({ jurusan }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-darkcard shadow border p-5">
      <h3 className="font-semibold mb-5">Tunggakan per Jurusan</h3>

      <div className="space-y-4">
        {jurusan.map((j) => (
          <div key={j.jurusan} className="flex justify-between">
            <span>{j.jurusan}</span>

            <b className="text-red-500">{rupiah(j.sisa)}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
