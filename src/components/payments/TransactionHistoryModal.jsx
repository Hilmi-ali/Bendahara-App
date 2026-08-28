import { useMemo, useState } from "react";
import {
  HiOutlineClock,
  HiOutlineInboxStack,
  HiXMark,
  HiArrowUturnLeft,
  HiCheck,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

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
  onUndo, // async (trx) => void — dipanggil saat admin konfirmasi undo
}) {
  const [confirmId, setConfirmId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return transactions;

    return transactions.filter((trx) =>
      String(trx.nama || "")
        .toLowerCase()
        .includes(keyword),
    );
  }, [transactions, search]);

  if (!open) return null;

  async function handleConfirmUndo(trx) {
    setLoadingId(trx.id);

    try {
      await onUndo?.(trx);
    } catch (err) {
      alert(err.message || "Gagal membatalkan transaksi.");
    }

    setLoadingId(null);
    setConfirmId(null);
  }

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
        </div>

        <div className="px-7 pt-6">
          <div className="relative max-w-md">
            <HiOutlineMagnifyingGlass
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama siswa..."
              className="
        w-full h-11 pl-10 pr-4
        rounded-xl
        border border-zinc-200 dark:border-zinc-700
        bg-white dark:bg-zinc-900
        text-sm text-zinc-900 dark:text-white
        placeholder:text-zinc-400
        outline-none
        focus:border-indigo-500
        transition-colors
      "
            />
          </div>

          {search && (
            <p className="mt-2 text-xs text-zinc-400">
              Ditemukan {filteredTransactions.length} transaksi
            </p>
          )}
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
                      Waktu
                    </th>
                    <th className="text-center px-5 font-medium text-[11px] uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10">
                        <div className="flex flex-col items-center gap-2 text-zinc-400">
                          <HiOutlineInboxStack size={28} />
                          <span className="text-sm">
                            Belum ada riwayat transaksi.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((trx) => (
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

                        <td className="px-5 py-3.5 text-center">
                          {trx.dibatalkan ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-400">
                              Dibatalkan
                            </span>
                          ) : confirmId === trx.id ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="text-[11px] text-zinc-400">
                                Yakin?
                              </span>
                              <button
                                onClick={() => handleConfirmUndo(trx)}
                                disabled={loadingId === trx.id}
                                title="Konfirmasi batalkan"
                                className="w-7 h-7 rounded-full flex items-center justify-center bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50 transition-colors"
                              >
                                <HiCheck size={14} />
                              </button>
                              <button
                                onClick={() => setConfirmId(null)}
                                disabled={loadingId === trx.id}
                                title="Batal"
                                className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                              >
                                <HiXMark size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmId(trx.id)}
                              title="Undo / batalkan transaksi ini"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                              <HiArrowUturnLeft size={13} />
                              Undo
                            </button>
                          )}
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
            Menampilkan {filteredTransactions.length} transaksi
          </span>

          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
