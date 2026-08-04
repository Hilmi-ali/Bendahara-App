import { HiOutlineClock, HiOutlineInboxStack, HiXMark } from "react-icons/hi2";

import Button from "../ui/Button";

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function TransactionHistoryModal({
  open,
  onClose,
  transactions,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex justify-center items-center p-5">
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c0f] shadow-2xl shadow-black/20">
        {/* HEADER */}
        <div className="relative px-8 pt-7 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="absolute top-6 right-7 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Tutup"
          >
            <HiXMark size={18} />
          </button>

          <p className="uppercase tracking-[2.5px] text-[11px] text-indigo-500 dark:text-indigo-400 font-semibold flex items-center gap-1.5">
            <HiOutlineClock size={13} />
            Riwayat
          </p>

          <h2 className="text-2xl font-bold mt-1.5 text-zinc-900 dark:text-white">
            Riwayat Transaksi
          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 text-sm">
            Daftar seluruh pembayaran yang tercatat pada tagihan ini.
          </p>
        </div>

        {/* TABLE */}
        <div className="px-7 pt-6">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div
              className="
              max-h-[60vh]
              overflow-auto

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
                      Nama
                    </th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider">
                      Tagihan
                    </th>
                    <th className="text-right font-medium text-[11px] uppercase tracking-wider">
                      Bayar
                    </th>
                    <th className="text-right pr-5 font-medium text-[11px] uppercase tracking-wider">
                      Potongan
                    </th>
                    <th className="text-left px-5 font-medium text-[11px] uppercase tracking-wider">
                      Operator
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10">
                        <div className="flex flex-col items-center gap-2 text-zinc-400">
                          <HiOutlineInboxStack size={28} />
                          <span className="text-sm">
                            Belum ada riwayat transaksi.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((trx) => (
                      <tr
                        key={trx.id}
                        className="border-t border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {initials(trx.nama)}
                            </div>
                            <span className="font-medium text-zinc-900 dark:text-white">
                              {trx.nama}
                            </span>
                          </div>
                        </td>

                        <td className="text-zinc-600 dark:text-zinc-300">
                          {trx.billName}
                        </td>

                        <td className="text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                          Rp {Number(trx.bayar).toLocaleString("id-ID")}
                        </td>

                        <td className="text-right pr-5 text-rose-500 dark:text-rose-400 font-semibold">
                          Rp {Number(trx.potongan).toLocaleString("id-ID")}
                        </td>

                        <td className="px-5 text-zinc-600 dark:text-zinc-300">
                          {trx.operator}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-7 py-6 mt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm text-zinc-400">
            Menampilkan {transactions.length} transaksi
          </span>

          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
