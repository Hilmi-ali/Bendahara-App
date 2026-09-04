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

function JurusanSummaryCard({ title, total, icon: Icon, variant = "default" }) {
  const styles = {
    AKL: {
      icon: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
      badge:
        "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
    TJKT: {
      icon: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      badge: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    TOTAL: {
      icon: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
      badge: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
    },
  };

  const style = styles[variant] || styles.TOTAL;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>

          <span
            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}
          >
            Total Tagihan
          </span>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {rupiah(total)}
        </p>
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

  const [exportPeriod, setExportPeriod] = useState("monthly");

  const [exportMonth, setExportMonth] = useState(new Date().getMonth() + 1);

  const [exportYear, setExportYear] = useState(new Date().getFullYear());

  const [exportJurusan, setExportJurusan] = useState("");

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

  const angkatanList = useMemo(() => {
    return [...new Set(reports.map((s) => s.angkatan))]
      .filter(Boolean)
      .sort((a, b) => Number(b) - Number(a));
  }, [reports]);
  const jurusanSummary = useMemo(() => {
    let akl = 0;
    let tjkt = 0;

    reports.forEach((student) => {
      const total = Number(student.totalTagihan || 0);

      if (student.jurusan === "AKL") {
        akl += total;
      }

      if (student.jurusan === "TJKT") {
        tjkt += total;
      }
    });

    return {
      AKL: akl,
      TJKT: tjkt,
      total: akl + tjkt,
    };
  }, [reports]);

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <JurusanSummaryCard
          title="Tagihan AKL"
          total={jurusanSummary.AKL}
          icon={HiOutlineUsers}
          variant="AKL"
        />

        <JurusanSummaryCard
          title="Tagihan TJKT"
          total={jurusanSummary.TJKT}
          icon={HiOutlineUsers}
          variant="TJKT"
        />

        <JurusanSummaryCard
          title="Total Seluruh Tagihan"
          total={jurusanSummary.total}
          icon={HiOutlineBanknotes}
          variant="TOTAL"
        />
      </div>

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
