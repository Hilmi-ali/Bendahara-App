import {
  HiXMark,
  HiDocumentArrowDown,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
} from "react-icons/hi2";

function rupiah(value) {
  return "Rp " + Number(value || 0).toLocaleString("id-ID");
}

const MONTHS = [
  {
    value: 1,
    label: "Januari",
  },
  {
    value: 2,
    label: "Februari",
  },
  {
    value: 3,
    label: "Maret",
  },
  {
    value: 4,
    label: "April",
  },
  {
    value: 5,
    label: "Mei",
  },
  {
    value: 6,
    label: "Juni",
  },
  {
    value: 7,
    label: "Juli",
  },
  {
    value: 8,
    label: "Agustus",
  },
  {
    value: 9,
    label: "September",
  },
  {
    value: 10,
    label: "Oktober",
  },
  {
    value: 11,
    label: "November",
  },
  {
    value: 12,
    label: "Desember",
  },
];

function currentYear() {
  return new Date().getFullYear();
}

function createYears() {
  const now = currentYear();

  return Array.from(
    {
      length: 6,
    },
    (_, index) => now - index,
  );
}

export default function ExcelPreviewModal({
  open,
  onClose,

  data = [],

  loading = false,

  period,
  setPeriod,

  month,
  setMonth,

  year,
  setYear,

  jurusan,
  setJurusan,

  periodLabel,

  onReload,

  onExport,
}) {
  if (!open) {
    return null;
  }

  /*
   * =========================================================
   * TOTAL
   * =========================================================
   */

  const total = data.reduce(
    (acc, item) => {
      const akl = item.AKL || {};

      const tjkt = item.TJKT || {};

      acc.aklTagihan += Number(akl.totalTagihan || 0);

      acc.aklMasuk += Number(akl.terbayarkan || 0);

      acc.aklSisa += Number(akl.sisa || 0);

      acc.tjktTagihan += Number(tjkt.totalTagihan || 0);

      acc.tjktMasuk += Number(tjkt.terbayarkan || 0);

      acc.tjktSisa += Number(tjkt.sisa || 0);

      return acc;
    },
    {
      aklTagihan: 0,
      aklMasuk: 0,
      aklSisa: 0,

      tjktTagihan: 0,
      tjktMasuk: 0,
      tjktSisa: 0,
    },
  );

  const totalTagihan = total.aklTagihan + total.tjktTagihan;

  const totalMasuk = total.aklMasuk + total.tjktMasuk;

  const totalSisa = total.aklSisa + total.tjktSisa;

  /*
   * =========================================================
   * RELOAD
   * =========================================================
   */

  async function handleReload() {
    if (!onReload) {
      return;
    }

    await onReload({
      period,

      month: Number(month),

      year: Number(year),

      jurusan,
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
      {/* BACKDROP */}

      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
              <HiOutlineBanknotes className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-white">
                Export Laporan Keuangan
              </h2>

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Rekap berdasarkan item tagihan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        {/* =================================================
            FILTER EXPORT
        ================================================= */}

        <div className="shrink-0 border-b border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {/* PERIODE */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Periode
              </label>

              <div className="grid grid-cols-2 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => setPeriod("monthly")}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    period === "monthly"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  Bulanan
                </button>

                <button
                  type="button"
                  onClick={() => setPeriod("yearly")}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    period === "yearly"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  Tahunan
                </button>
              </div>
            </div>

            {/* BULAN */}

            {period === "monthly" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Bulan
                </label>

                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  {MONTHS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* TAHUN */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Tahun
              </label>

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                {createYears().map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* JURUSAN */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Jurusan
              </label>

              <select
                value={jurusan}
                onChange={(e) => setJurusan(e.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="">AKL & TJKT</option>

                <option value="AKL">AKL</option>

                <option value="TJKT">TJKT</option>
              </select>
            </div>
          </div>

          {/* LOAD */}

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleReload}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <HiOutlineCalendarDays className="h-4 w-4" />

              {loading ? "Memuat..." : "Tampilkan Laporan"}
            </button>
          </div>
        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="grid shrink-0 grid-cols-1 gap-3 border-b border-zinc-200 p-4 sm:grid-cols-3 dark:border-zinc-800">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium text-zinc-500">Periode</p>

            <p className="mt-1 font-semibold text-zinc-900 dark:text-white">
              {periodLabel}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium text-zinc-500">Terbayarkan</p>

            <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
              {rupiah(totalMasuk)}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium text-zinc-500">Sisa</p>

            <p className="mt-1 font-semibold text-red-600 dark:text-red-400">
              {rupiah(totalSisa)}
            </p>
          </div>
        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="min-w-[1400px] w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10">
              {/* GROUP HEADER */}

              <tr className="border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                <th
                  rowSpan={2}
                  className="border-r border-zinc-200 px-4 py-3 text-left font-semibold text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                >
                  No
                </th>

                <th
                  rowSpan={2}
                  className="border-r border-zinc-200 px-4 py-3 text-left font-semibold text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                >
                  Item Tagihan
                </th>

                <th
                  colSpan={4}
                  className="border-r border-zinc-200 px-4 py-3 text-center font-semibold text-purple-600 dark:border-zinc-800 dark:text-purple-400"
                >
                  AKL
                </th>

                <th
                  colSpan={4}
                  className="border-r border-zinc-200 px-4 py-3 text-center font-semibold text-blue-600 dark:border-zinc-800 dark:text-blue-400"
                >
                  TJKT
                </th>

                <th
                  colSpan={3}
                  className="px-4 py-3 text-center font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  TOTAL KESELURUHAN
                </th>
              </tr>

              {/* SUB HEADER */}

              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {/* AKL */}

                <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                  Nominal/Siswa
                </th>

                <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                  Total Tagihan
                </th>

                <th className="px-3 py-2 text-right text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Terbayarkan
                </th>

                <th className="border-r border-zinc-200 px-3 py-2 text-right text-xs font-medium text-red-600 dark:border-zinc-800 dark:text-red-400">
                  Sisa
                </th>

                {/* TJKT */}

                <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                  Nominal/Siswa
                </th>

                <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                  Total Tagihan
                </th>

                <th className="px-3 py-2 text-right text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Terbayarkan
                </th>

                <th className="border-r border-zinc-200 px-3 py-2 text-right text-xs font-medium text-red-600 dark:border-zinc-800 dark:text-red-400">
                  Sisa
                </th>

                {/* TOTAL */}

                <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                  Total Tagihan
                </th>

                <th className="px-3 py-2 text-right text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Terbayarkan
                </th>

                <th className="px-3 py-2 text-right text-xs font-medium text-red-600 dark:text-red-400">
                  Sisa
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={13}
                    className="px-4 py-12 text-center text-zinc-500"
                  >
                    Menyiapkan laporan...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={13}
                    className="px-4 py-12 text-center text-zinc-500"
                  >
                    Tidak ada data laporan untuk periode ini.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => {
                  const akl = item.AKL || {};

                  const tjkt = item.TJKT || {};

                  const itemTagihan =
                    Number(akl.totalTagihan || 0) +
                    Number(tjkt.totalTagihan || 0);

                  const itemMasuk =
                    Number(akl.terbayarkan || 0) +
                    Number(tjkt.terbayarkan || 0);

                  const itemSisa =
                    Number(akl.sisa || 0) + Number(tjkt.sisa || 0);

                  return (
                    <tr
                      key={`${item.namaTagihan}-${index}`}
                      className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800/70 dark:hover:bg-zinc-900/60"
                    >
                      <td className="px-4 py-3 text-zinc-500">{index + 1}</td>

                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                        {item.namaTagihan}
                      </td>

                      {/* AKL */}

                      <td className="px-3 py-3 text-right text-zinc-600 dark:text-zinc-400">
                        {rupiah(akl.nominalSiswa)}
                      </td>

                      <td className="px-3 py-3 text-right text-zinc-700 dark:text-zinc-300">
                        {rupiah(akl.totalTagihan)}
                      </td>

                      <td className="px-3 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {rupiah(akl.terbayarkan)}
                      </td>

                      <td className="border-r border-zinc-100 px-3 py-3 text-right font-medium text-red-600 dark:border-zinc-800 dark:text-red-400">
                        {rupiah(akl.sisa)}
                      </td>

                      {/* TJKT */}

                      <td className="px-3 py-3 text-right text-zinc-600 dark:text-zinc-400">
                        {rupiah(tjkt.nominalSiswa)}
                      </td>

                      <td className="px-3 py-3 text-right text-zinc-700 dark:text-zinc-300">
                        {rupiah(tjkt.totalTagihan)}
                      </td>

                      <td className="px-3 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {rupiah(tjkt.terbayarkan)}
                      </td>

                      <td className="border-r border-zinc-100 px-3 py-3 text-right font-medium text-red-600 dark:border-zinc-800 dark:text-red-400">
                        {rupiah(tjkt.sisa)}
                      </td>

                      {/* TOTAL */}

                      <td className="px-3 py-3 text-right font-semibold text-zinc-800 dark:text-zinc-200">
                        {rupiah(itemTagihan)}
                      </td>

                      <td className="px-3 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {rupiah(itemMasuk)}
                      </td>

                      <td className="px-3 py-3 text-right font-semibold text-red-600 dark:text-red-400">
                        {rupiah(itemSisa)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* =================================================
                TOTAL
            ================================================= */}

            {data.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                  <td
                    colSpan={2}
                    className="px-4 py-4 font-bold text-zinc-900 dark:text-white"
                  >
                    TOTAL
                  </td>

                  {/* AKL */}

                  <td className="px-3 py-4 text-right font-bold text-zinc-500">
                    -
                  </td>

                  <td className="px-3 py-4 text-right font-bold text-zinc-900 dark:text-white">
                    {rupiah(total.aklTagihan)}
                  </td>

                  <td className="px-3 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {rupiah(total.aklMasuk)}
                  </td>

                  <td className="border-r border-zinc-200 px-3 py-4 text-right font-bold text-red-600 dark:border-zinc-800 dark:text-red-400">
                    {rupiah(total.aklSisa)}
                  </td>

                  {/* TJKT */}

                  <td className="px-3 py-4 text-right font-bold text-zinc-500">
                    -
                  </td>

                  <td className="px-3 py-4 text-right font-bold text-zinc-900 dark:text-white">
                    {rupiah(total.tjktTagihan)}
                  </td>

                  <td className="px-3 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {rupiah(total.tjktMasuk)}
                  </td>

                  <td className="border-r border-zinc-200 px-3 py-4 text-right font-bold text-red-600 dark:border-zinc-800 dark:text-red-400">
                    {rupiah(total.tjktSisa)}
                  </td>

                  {/* TOTAL */}

                  <td className="px-3 py-4 text-right font-bold text-zinc-900 dark:text-white">
                    {rupiah(totalTagihan)}
                  </td>

                  <td className="px-3 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {rupiah(totalMasuk)}
                  </td>

                  <td className="px-3 py-4 text-right font-bold text-red-600 dark:text-red-400">
                    {rupiah(totalSisa)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex shrink-0 flex-col gap-3 border-t border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {periodLabel}
            </span>
            <span className="mx-2">•</span>
            {data.length.toLocaleString("id-ID")} item tagihan
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={onExport}
              disabled={loading || data.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <HiDocumentArrowDown className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
