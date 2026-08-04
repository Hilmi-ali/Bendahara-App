function rupiah(v) {
  return "Rp " + Number(v).toLocaleString("id-ID");
}

export default function TopStudents({ students }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-darkcard shadow border p-5">
      <h3 className="font-semibold mb-5">Top Pembayar</h3>

      <div className="space-y-3">
        {students.map((s, index) => (
          <div
            key={s.nis}
            className="flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-800 p-3"
          >
            <div>
              <div className="font-medium">
                {index + 1}. {s.nama}
              </div>

              <div className="text-xs text-zinc-500">{s.nis}</div>
            </div>

            <b className="text-green-600">{rupiah(s.totalDibayar)}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
