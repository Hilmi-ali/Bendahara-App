import { useMemo, useState } from "react";
import {
  HiDocumentArrowDown,
  HiMagnifyingGlass,
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineUsers,
  HiOutlineFaceSmile,
} from "react-icons/hi2";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import ExcelPreviewModal from "../components/reports/ExcelPreviewModal";

import useReports from "../hooks/useReports";

function rupiah(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

const JURUSAN_STYLE = {
  TJKT: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  AKL: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
};

function JurusanBadge({ value }) {
  if (!value) return <span className="text-zinc-400">-</span>;
  const style =
    JURUSAN_STYLE[value] ||
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      {value}
    </span>
  );
}

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function Reports() {
  const { reports, summary, loading, exportExcel } = useReports();
  const [search, setSearch] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const filtered = useMemo(() => {
    return reports.filter((s) => {
      const cocokNama =
        s.nama?.toLowerCase().includes(search.toLowerCase()) ||
        s.nis?.includes(search);

      const cocokJurusan = jurusan ? s.jurusan === jurusan : true;

      const cocokAngkatan = angkatan
        ? Number(s.angkatan) === Number(angkatan)
        : true;

      return cocokNama && cocokJurusan && cocokAngkatan;
    });
  }, [reports, search, jurusan, angkatan]);

  const angkatanList = [...new Set(reports.map((s) => s.angkatan))]
    .filter(Boolean)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      {/* FILTER */}
      <div className="rounded-3xl bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/20 dark:border-white/5 p-5">
        <div className="flex flex-wrap gap-3">
          <div className="w-full sm:w-72">
            <Input
              icon={HiMagnifyingGlass}
              placeholder="Cari nama atau NIS siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="w-full sm:w-44 h-11 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-darkcard px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-shadow dark:text-white"
            value={jurusan}
            onChange={(e) => setJurusan(e.target.value)}
          >
            <option value="">Semua Jurusan</option>
            <option value="TJKT">TJKT</option>
            <option value="AKL">AKL</option>
          </select>

          <select
            className="w-full sm:w-40 h-11 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-darkcard px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-shadow dark:text-white"
            value={angkatan}
            onChange={(e) => setAngkatan(e.target.value)}
          >
            <option value="">Semua Angkatan</option>
            {angkatanList.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {(search || jurusan || angkatan) && (
            <span className="self-center text-xs text-zinc-400">
              {filtered.length} hasil ditemukan
            </span>
          )}

          <div className="flex-1" />

          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            icon={HiDocumentArrowDown}
            onClick={() => setPreviewOpen(true)}
          >
            Export Excel
          </Button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/20 dark:border-white/5 p-6">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-indigo-500 opacity-10 blur-2xl" />
          <div className="relative flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <HiOutlineCalendarDays size={20} />
            </div>
            <h3 className="font-bold text-lg dark:text-white">
              Ringkasan Bulan Ini
            </h3>
          </div>

          <div className="relative space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-dashed border-zinc-200 dark:border-zinc-700">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Total Pembayaran
              </span>
              <b className="text-lg dark:text-white">
                {rupiah(summary.monthlySummary.count)}
              </b>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Jumlah Transaksi
              </span>
              <b className="text-lg dark:text-white">
                {summary.monthlySummary.count}
              </b>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/20 dark:border-white/5 p-6">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-emerald-500 opacity-10 blur-2xl" />
          <div className="relative flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <HiOutlineUsers size={20} />
            </div>
            <h3 className="font-bold text-lg dark:text-white">
              Ringkasan Tahun Ini
            </h3>
          </div>

          <div className="relative space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-dashed border-zinc-200 dark:border-zinc-700">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Total Pembayaran
              </span>
              <b className="text-lg dark:text-white">
                {rupiah(summary.yearlySummary.count)}
              </b>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Jumlah Transaksi
              </span>
              <b className="text-lg dark:text-white">
                {summary.yearlySummary.count}
              </b>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-3xl bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/20 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="custom-scroll max-h-[560px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-zinc-50 dark:bg-zinc-800/95 backdrop-blur">
                <tr className="text-left text-zinc-500 dark:text-zinc-400">
                  <th className="p-4 font-semibold">NIS</th>
                  <th className="font-semibold">Nama</th>
                  <th className="font-semibold">Jurusan</th>
                  <th className="font-semibold">Angkatan</th>
                  <th className="font-semibold">Total Tagihan</th>
                  <th className="font-semibold">Dibayar</th>
                  <th className="font-semibold">Potongan</th>
                  <th className="font-semibold">Sisa</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-zinc-400">
                      Memuat data laporan...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-10">
                      <div className="flex flex-col items-center gap-2 text-zinc-400">
                        <HiOutlineFaceSmile size={32} />
                        <span className="text-sm">
                          Tidak ada data yang cocok dengan filter.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.nis}
                      className="border-t border-zinc-100 dark:border-zinc-700/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                    >
                      <td className="p-4 font-medium text-zinc-500 dark:text-zinc-400">
                        {item.nis}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {initials(item.nama)}
                          </div>
                          <span className="font-semibold dark:text-white">
                            {item.nama}
                          </span>
                        </div>
                      </td>
                      <td>
                        <JurusanBadge value={item.jurusan} />
                      </td>
                      <td className="dark:text-zinc-300">{item.angkatan}</td>
                      <td className="dark:text-zinc-300">
                        {rupiah(item.totalTagihan)}
                      </td>
                      <td className="text-green-600 dark:text-green-400 font-semibold">
                        {rupiah(item.totalDibayar)}
                      </td>

                      <td className="text-amber-600 dark:text-amber-400 font-semibold">
                        {rupiah(item.totalPotongan)}
                      </td>

                      <td className="text-red-500 dark:text-red-400 font-semibold">
                        {rupiah(item.totalSisa)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Scrollbar modern untuk area tabel */}
      <style>{`
        .custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(113, 113, 122, 0.4) transparent;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(113, 113, 122, 0.35);
          border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(113, 113, 122, 0.6);
        }
        .dark .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(212, 212, 216, 0.25);
        }
        .dark .custom-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(212, 212, 216, 0.45);
        }
      `}</style>

      <ExcelPreviewModal
        open={previewOpen}
        data={filtered}
        onClose={() => setPreviewOpen(false)}
        onExport={(rows) => {
          exportExcel(rows);
          setPreviewOpen(false);
        }}
      />
    </div>
  );
}
