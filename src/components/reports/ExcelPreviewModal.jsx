import {
  HiDocumentChartBar,
  HiBanknotes,
  HiCreditCard,
  HiExclamationTriangle,
  HiXMark,
} from "react-icons/hi2";

import Button from "../ui/Button";

function rupiah(v) {
  return "Rp " + Number(v || 0).toLocaleString("id-ID");
}

export default function ExcelPreviewModal({ open, data, onClose, onExport }) {
  if (!open) return null;

  const totalTagihan = data.reduce(
    (a, b) => a + Number(b.totalTagihan || 0),
    0,
  );

  const totalDibayar = data.reduce(
    (a, b) => a + Number(b.totalDibayar || 0),
    0,
  );
  const totalPotongan = data.reduce(
    (a, b) => a + Number(b.totalPotongan || 0),
    0,
  );

  const totalSisa = data.reduce((a, b) => a + Number(b.totalSisa || 0), 0);

  const sisaRows = Math.max(data.length - 10, 0);

  return (
    <div className="fixed inset-0 z-[999] bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div
        className="
  w-full
  max-w-5xl
  max-h-[90vh]
  rounded-2xl
  overflow-hidden
  border
  border-zinc-200
  dark:border-zinc-800
  bg-white
  dark:bg-[#0b0c0f]
  shadow-2xl
  shadow-black/20
  flex
  flex-col
"
      >
        <div className="relative px-8 pt-7 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="absolute top-6 right-7 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Tutup"
          >
            <HiXMark size={18} />
          </button>

          <p className="uppercase tracking-[2.5px] text-[11px] text-indigo-500 dark:text-indigo-400 font-semibold">
            Export Preview
          </p>

          <h2 className="text-2xl font-bold mt-1.5 text-zinc-900 dark:text-white">
            Preview Excel
          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 text-sm">
            Data yang akan diekspor ke Microsoft Excel
          </p>

          {/* QUICK STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-3">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <HiDocumentChartBar size={14} />
                Total Siswa
              </div>
              <div className="text-lg font-bold text-zinc-900 dark:text-white">
                {data.length}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-3">
              <div className="flex items-center gap-1.5 text-blue-500 text-xs mb-1">
                <HiBanknotes size={14} />
                Total Tagihan
              </div>
              <div className="text-lg font-bold text-zinc-900 dark:text-white truncate">
                {rupiah(totalTagihan)}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-3">
              <div className="flex items-center gap-1.5 text-emerald-500 text-xs mb-1">
                <HiCreditCard size={14} />
                Dibayar
              </div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 truncate">
                {rupiah(totalDibayar)}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-3">
              <div className="flex items-center gap-1.5 text-amber-500 text-xs mb-1">
                <HiBanknotes size={14} />
                Potongan
              </div>

              <div className="text-lg font-bold text-amber-600 dark:text-amber-400 truncate">
                {rupiah(totalPotongan)}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-3">
              <div className="flex items-center gap-1.5 text-rose-500 text-xs mb-1">
                <HiExclamationTriangle size={14} />
                Sisa
              </div>
              <div className="text-lg font-bold text-rose-500 dark:text-rose-400 truncate">
                {rupiah(totalSisa)}
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="px-7 pt-6">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div
              className="
              max-h-[320px]
              overflow-y-auto

              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-zinc-300
              dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700
              [&::-webkit-scrollbar-thumb]:rounded-full
              "
            >
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur z-20">
                  <tr className="text-zinc-500 dark:text-zinc-400">
                    <th className="px-5 py-3 text-left font-medium text-[11px] uppercase tracking-wider">
                      NIS
                    </th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider">
                      Jurusan
                    </th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider">
                      Angkatan
                    </th>
                    <th className="text-right pr-5 font-medium text-[11px] uppercase tracking-wider">
                      Tagihan
                    </th>
                    <th className="text-right pr-5 font-medium text-[11px] uppercase tracking-wider">
                      Dibayar
                    </th>
                    <th className="text-right pr-5 font-medium text-[11px] uppercase tracking-wider">
                      Potongan
                    </th>
                    <th className="text-right pr-5 font-medium text-[11px] uppercase tracking-wider">
                      Sisa
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.slice(0, 10).map((item) => (
                    <tr
                      key={item.nis}
                      className="
                      border-t
                      border-zinc-100
                      dark:border-zinc-800
                      hover:bg-zinc-50
                      dark:hover:bg-zinc-900
                      transition-colors
                      "
                    >
                      <td className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
                        {item.nis}
                      </td>

                      <td className="font-medium text-zinc-900 dark:text-white">
                        {item.nama}
                      </td>

                      <td className="text-zinc-600 dark:text-zinc-300">
                        {item.jurusan}
                      </td>

                      <td className="text-zinc-600 dark:text-zinc-300">
                        {item.angkatan}
                      </td>

                      <td className="text-right pr-5 text-zinc-600 dark:text-zinc-300">
                        {rupiah(item.totalTagihan)}
                      </td>

                      <td className="text-right pr-5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        {rupiah(item.totalDibayar)}
                      </td>
                      <td className="text-right pr-5 text-amber-600 dark:text-amber-400 font-semibold">
                        {rupiah(item.totalPotongan)}
                      </td>
                      <td className="text-right pr-5 text-rose-500 dark:text-rose-400 font-semibold">
                        {rupiah(item.totalSisa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {sisaRows > 0 && (
            <p className="text-xs text-zinc-400 mt-2.5 px-1">
              +{sisaRows} data lainnya akan tetap disertakan dalam file export.
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div
          className="
    sticky
    bottom-0
    px-7
    py-5
    border-t
    border-zinc-100
    dark:border-zinc-800
    bg-white
    dark:bg-[#0b0c0f]
    flex
    flex-col
    sm:flex-row
    justify-between
    items-center
    gap-4
    shrink-0
  "
        >
          <div className="flex items-center gap-2.5 text-zinc-400 text-sm">
            <HiDocumentChartBar size={18} />
            <span>File akan diekspor dalam format Microsoft Excel (.xlsx)</span>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Batal
            </Button>

            <Button onClick={() => onExport(data)}>Export Excel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
