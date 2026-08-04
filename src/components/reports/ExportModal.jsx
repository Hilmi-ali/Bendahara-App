import Button from "../ui/Button";

function rupiah(v) {
  return "Rp " + Number(v || 0).toLocaleString("id-ID");
}

export default function ExportModal({
  open,
  rows = [],
  filters = {},
  onClose,
  onExport,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-6">
      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-darkcard shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        {/* Header */}

        <div className="px-7 py-5 border-b">
          <h2 className="text-2xl font-bold dark:text-white">
            Preview Export Excel
          </h2>

          <p className="text-sm text-zinc-500 mt-1">
            Periksa data sebelum mengunduh.
          </p>
        </div>

        {/* Summary */}

        <div className="grid grid-cols-4 gap-5 p-6 border-b bg-zinc-50 dark:bg-zinc-900">
          <div>
            <div className="text-xs text-zinc-500">Total Data</div>

            <div className="font-bold text-xl">{rows.length}</div>
          </div>

          <div>
            <div className="text-xs text-zinc-500">Jurusan</div>

            <div className="font-semibold">{filters.jurusan || "Semua"}</div>
          </div>

          <div>
            <div className="text-xs text-zinc-500">Angkatan</div>

            <div className="font-semibold">{filters.angkatan || "Semua"}</div>
          </div>

          <div>
            <div className="text-xs text-zinc-500">Total Dibayar</div>

            <div className="font-bold text-green-600">
              {rupiah(
                rows.reduce((a, b) => a + Number(b.totalDibayar || 0), 0),
              )}
            </div>
          </div>
        </div>

        {/* Table */}

        <div className="max-h-[430px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white dark:bg-darkcard border-b">
              <tr>
                <th className="text-left p-4">NIS</th>

                <th className="text-left">Nama</th>

                <th>Jurusan</th>

                <th>Angkatan</th>

                <th>Total</th>

                <th>Dibayar</th>

                <th>Sisa</th>
              </tr>
            </thead>

            <tbody>
              {rows.slice(0, 10).map((item) => (
                <tr
                  key={item.nis}
                  className="border-b hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <td className="p-4">{item.nis}</td>

                  <td>{item.nama}</td>

                  <td>{item.jurusan}</td>

                  <td>{item.angkatan}</td>

                  <td>{rupiah(item.totalTagihan)}</td>

                  <td className="text-green-600">
                    {rupiah(item.totalDibayar)}
                  </td>

                  <td className="text-red-500">{rupiah(item.totalSisa)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}

        <div className="px-6 py-5 border-t flex justify-between items-center">
          <div className="text-sm text-zinc-500">
            Menampilkan
            <b> {Math.min(rows.length, 10)} </b>
            dari
            <b> {rows.length} </b>
            data.
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Batal
            </Button>

            <Button onClick={onExport}>Export Excel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
