import { useMemo, useState } from "react";

import {
  HiDocumentArrowDown,
  HiMagnifyingGlass,
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineUsers,
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
  if (!value) {
    return <span className="text-zinc-400">-</span>;
  }

  const style =
    JURUSAN_STYLE[value] ||
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
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

function PeriodSummaryCard({ title, period, total, count, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>

          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            {period}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {rupiah(total)}
        </p>

        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <HiOutlineBanknotes className="h-4 w-4" />

          <span>{Number(count || 0).toLocaleString("id-ID")} transaksi</span>
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const {
    reports,
    summary,
    loading,
    refresh,

    financialReport,
    financialLoading,
    loadFinancialReport,
    exportExcel,
  } = useReports();

  const [search, setSearch] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [angkatan, setAngkatan] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);

  /*
   * =========================================================
   * FILTER EXPORT
   * =========================================================
   */

  const [exportPeriod, setExportPeriod] = useState("monthly");

  const [exportMonth, setExportMonth] = useState(new Date().getMonth() + 1);

  const [exportYear, setExportYear] = useState(new Date().getFullYear());

  const [exportJurusan, setExportJurusan] = useState("");

  /*
   * =========================================================
   * FILTER SISWA
   * =========================================================
   */

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return reports.filter((s) => {
      const cocokNama =
        !keyword ||
        s.nama?.toLowerCase().includes(keyword) ||
        String(s.nis || "").includes(keyword);

      const cocokJurusan = jurusan ? s.jurusan === jurusan : true;

      const cocokAngkatan = angkatan
        ? Number(s.angkatan) === Number(angkatan)
        : true;

      return cocokNama && cocokJurusan && cocokAngkatan;
    });
  }, [reports, search, jurusan, angkatan]);

  /*
   * =========================================================
   * ANGKATAN
   * =========================================================
   */

  const angkatanList = useMemo(() => {
    return [...new Set(reports.map((s) => s.angkatan))]
      .filter(Boolean)
      .sort((a, b) => Number(b) - Number(a));
  }, [reports]);

  /*
   * =========================================================
   * LABEL PERIODE
   * =========================================================
   */

  const monthLabel = useMemo(() => {
    return new Date(exportYear, Number(exportMonth) - 1, 1).toLocaleString(
      "id-ID",
      {
        month: "long",
        year: "numeric",
      },
    );
  }, [exportMonth, exportYear]);

  const periodLabel = useMemo(() => {
    if (exportPeriod === "monthly") {
      return monthLabel;
    }

    return `Tahun ${exportYear}`;
  }, [exportPeriod, monthLabel, exportYear]);

  /*
   * =========================================================
   * OPEN EXPORT
   * =========================================================
   */

  async function handleOpenExport() {
    try {
      await loadFinancialReport({
        period: exportPeriod,
        month: Number(exportMonth),
        year: Number(exportYear),
        jurusan: exportJurusan,
      });

      setPreviewOpen(true);
    } catch (error) {
      console.error("Gagal menyiapkan laporan keuangan:", error);

      alert("Gagal menyiapkan laporan keuangan. Silakan coba lagi.");
    }
  }

  /*
   * =========================================================
   * EXPORT
   * =========================================================
   */

  async function handleExport() {
    try {
      await exportExcel({
        period: exportPeriod,
        month: Number(exportMonth),
        year: Number(exportYear),
        jurusan: exportJurusan,
        data: financialReport,
      });
    } catch (error) {
      console.error("Gagal export laporan:", error);

      alert("Gagal membuat file Excel. Silakan coba lagi.");
    }
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Laporan
            </h1>

            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              KEUANGAN
            </span>
          </div>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Rekap pembayaran dan laporan keuangan sekolah
          </p>
        </div>

        <Button
          onClick={handleOpenExport}
          disabled={financialLoading}
          className="inline-flex items-center justify-center gap-2"
        >
          <HiDocumentArrowDown className="h-5 w-5" />

          {financialLoading ? "Menyiapkan..." : "Export Laporan Keuangan"}
        </Button>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PeriodSummaryCard
          title="Uang Masuk Bulan Ini"
          period={new Date().toLocaleString("id-ID", {
            month: "long",
            year: "numeric",
          })}
          total={summary.monthlySummary.total}
          count={summary.monthlySummary.count}
          icon={HiOutlineCalendarDays}
        />

        <PeriodSummaryCard
          title="Uang Masuk Tahun Ini"
          period={`Tahun ${new Date().getFullYear()}`}
          total={summary.yearlySummary.total}
          count={summary.yearlySummary.count}
          icon={HiOutlineBanknotes}
        />
      </div>

      {/* =====================================================
          FILTER DATA SISWA
      ===================================================== */}

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2">
          <HiOutlineUsers className="h-5 w-5 text-zinc-500" />

          <h2 className="font-semibold text-zinc-900 dark:text-white">
            Filter Data Siswa
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {/* SEARCH */}

          <div className="relative md:col-span-2">
            <HiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-zinc-400" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau NIS..."
              className="pl-10"
            />
          </div>

          {/* JURUSAN */}

          <select
            value={jurusan}
            onChange={(e) => setJurusan(e.target.value)}
            className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <option value="">Semua Jurusan</option>
            <option value="AKL">AKL</option>
            <option value="TJKT">TJKT</option>
          </select>

          {/* ANGKATAN */}

          <select
            value={angkatan}
            onChange={(e) => setAngkatan(e.target.value)}
            className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <option value="">Semua Angkatan</option>

            {angkatanList.map((item) => (
              <option key={item} value={item}>
                Angkatan {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =====================================================
          STUDENT REPORT
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-2 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-zinc-900 dark:text-white">
              Rekap Tagihan Siswa
            </h2>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Menampilkan {filtered.length.toLocaleString("id-ID")} siswa
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-white"
          >
            {loading ? "Memuat..." : "Refresh"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[950px] w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40">
                <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-400">
                  Siswa
                </th>

                <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-400">
                  NIS
                </th>

                <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-400">
                  Jurusan
                </th>

                <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-400">
                  Angkatan
                </th>

                <th className="px-4 py-3 text-right font-semibold text-zinc-600 dark:text-zinc-400">
                  Total Tagihan
                </th>

                <th className="px-4 py-3 text-right font-semibold text-zinc-600 dark:text-zinc-400">
                  Dibayar
                </th>

                <th className="px-4 py-3 text-right font-semibold text-zinc-600 dark:text-zinc-400">
                  Potongan
                </th>

                <th className="px-4 py-3 text-right font-semibold text-zinc-600 dark:text-zinc-400">
                  Sisa
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-zinc-500"
                  >
                    Memuat laporan...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-zinc-500"
                  >
                    Tidak ada data laporan.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800/70 dark:hover:bg-zinc-800/30"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {initials(student.nama)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-zinc-900 dark:text-white">
                            {student.nama || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400">
                      {student.nis || "-"}
                    </td>

                    <td className="px-4 py-3.5">
                      <JurusanBadge value={student.jurusan} />
                    </td>

                    <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400">
                      {student.angkatan || "-"}
                    </td>

                    <td className="px-4 py-3.5 text-right font-medium text-zinc-800 dark:text-zinc-200">
                      {rupiah(student.totalTagihan)}
                    </td>

                    <td className="px-4 py-3.5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      {rupiah(student.totalDibayar)}
                    </td>

                    <td className="px-4 py-3.5 text-right text-amber-600 dark:text-amber-400">
                      {rupiah(student.totalPotongan)}
                    </td>

                    <td className="px-4 py-3.5 text-right font-semibold text-red-600 dark:text-red-400">
                      {rupiah(student.totalSisa)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          EXCEL PREVIEW
      ===================================================== */}

      <ExcelPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={financialReport}
        loading={financialLoading}
        period={exportPeriod}
        setPeriod={setExportPeriod}
        month={exportMonth}
        setMonth={setExportMonth}
        year={exportYear}
        setYear={setExportYear}
        jurusan={exportJurusan}
        setJurusan={setExportJurusan}
        periodLabel={periodLabel}
        onReload={loadFinancialReport}
        onExport={handleExport}
      />
    </div>
  );
}
