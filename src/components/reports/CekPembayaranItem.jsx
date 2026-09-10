import { useEffect, useMemo, useState } from "react";
import {
  HiCheck,
  HiDocumentArrowDown,
  HiMagnifyingGlass,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import * as XLSX from "xlsx";

import Input from "../ui/Input";
import Button from "../ui/Button";
import usePaymentCheck from "../../hooks/usePaymentCheck";

const MAIN_TABS = [
  { key: "ASTS", label: "ASTS", keyword: "ASTS" },
  { key: "ASAS", label: "ASAS", keyword: "ASAS" },
  { key: "KI", label: "Kunjungan Industri", keyword: "Kunjungan" },
];

function rupiah(value) {
  return "Rp " + Number(value || 0).toLocaleString("id-ID");
}

function getStatusStyle(status) {
  const value = String(status || "").toLowerCase();

  if (value.includes("lunas")) {
    return {
      className:
        "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
      icon: <HiCheck className="h-3.5 w-3.5" />,
    };
  }

  if (value.includes("sebagian")) {
    return {
      className:
        "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
      icon: <HiOutlineExclamationCircle className="h-3.5 w-3.5" />,
    };
  }

  return {
    className:
      "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900",
    icon: <HiOutlineExclamationCircle className="h-3.5 w-3.5" />,
  };
}

function getInitials(name) {
  return String(name || "")
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export default function CekPembayaranItem() {
  const [activeTab, setActiveTab] = useState("ASTS");
  const [activeSubItem, setActiveSubItem] = useState("");
  const [search, setSearch] = useState("");

  const currentKeyword = MAIN_TABS.find(
    (tab) => tab.key === activeTab,
  )?.keyword;

  const { rawData, subItems, loading } = usePaymentCheck(currentKeyword);

  useEffect(() => {
    setActiveSubItem((previous) =>
      subItems.includes(previous) ? previous : subItems[0] || "",
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, subItems.join("|")]);

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return rawData
      .filter((item) =>
        activeSubItem ? item.namaTagihan === activeSubItem : true,
      )
      .filter(
        (item) =>
          !keyword ||
          String(item.namaSiswa).toLowerCase().includes(keyword) ||
          String(item.nis).includes(keyword),
      );
  }, [rawData, activeSubItem, search]);

  function handleExport() {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const rows = filteredData.map((item, index) => ({
      No: index + 1,
      NIS: item.nis,
      Nama: item.namaSiswa,
      Jurusan: item.jurusan,
      Angkatan: item.angkatan,
      "Item Tagihan": item.namaTagihan,
      Nominal: item.nominal,
      Dibayar: item.dibayar,
      Potongan: item.potongan,
      Sisa: item.sisa,
      Status: item.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      (activeSubItem || activeTab).slice(0, 31),
    );

    XLSX.writeFile(
      workbook,
      `Pembayaran_${(activeSubItem || activeTab).replace(/\s+/g, "_")}.xlsx`,
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-white">
            Cek Pembayaran Tagihan
          </h3>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={HiDocumentArrowDown}
          onClick={handleExport}
          disabled={loading || filteredData.length === 0}
          className="!h-9 !rounded-xl !border-teal-200 !px-3 !text-xs !font-semibold !text-teal-700 hover:!border-teal-300 hover:!bg-teal-50 dark:!border-teal-900 dark:!text-teal-300 dark:hover:!bg-teal-950/40"
        >
          Export Excel
        </Button>
      </div>

      {/* Main tabs */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-zinc-200 dark:border-zinc-800">
        {MAIN_TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative whitespace-nowrap pb-2.5 text-xs font-bold transition-colors ${
                isActive
                  ? "text-teal-700 dark:text-teal-400"
                  : "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              }`}
            >
              {tab.label}

              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-teal-600 dark:bg-teal-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sub filters and search */}
      <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {subItems.length > 0 ? (
            <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto">
              <span className="mr-1 shrink-0 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                Item
              </span>

              {subItems.map((item) => {
                const isActive = activeSubItem === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveSubItem(item)}
                    className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                      isActive
                        ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20"
                        : "bg-zinc-100 text-zinc-600 hover:bg-teal-50 hover:text-teal-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-teal-950/50 dark:hover:text-teal-300"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          ) : (
            <div />
          )}

          <div className="relative w-full shrink-0 lg:w-64">
            <HiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <Input
              type="search"
              placeholder="Cari nama / NIS..."
              aria-label="Cari nama atau NIS siswa"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="!h-9 !rounded-lg !bg-zinc-50 !pl-9 !pr-3 !text-xs dark:!bg-zinc-950"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left dark:border-zinc-800 dark:bg-zinc-950/70">
                {[
                  "NIS",
                  "Nama",
                  "Jurusan",
                  "Angkatan",
                  "Item",
                  "Dibayar",
                  "Sisa",
                  "Status",
                ].map((heading, index) => (
                  <th
                    key={heading}
                    className={`whitespace-nowrap px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 ${
                      index === 5 || index === 6 ? "text-right" : ""
                    }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-xs text-zinc-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-xs text-zinc-400"
                  >
                    Tidak ada siswa yang cocok.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const statusStyle = getStatusStyle(item.status);
                  const isPaid = Number(item.dibayar || 0) > 0;
                  const hasRemaining = Number(item.sisa || 0) > 0;

                  return (
                    <tr
                      key={`${item.nis}-${item.billId}`}
                      className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-teal-50/40 dark:border-zinc-800 dark:hover:bg-teal-950/20"
                    >
                      <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                        {item.nis}
                      </td>

                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-teal-50 text-[10px] font-bold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                            {getInitials(item.namaSiswa)}
                          </span>

                          <span className="whitespace-nowrap font-semibold text-zinc-800 dark:text-zinc-100">
                            {item.namaSiswa}
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-zinc-600 dark:text-zinc-300">
                        {item.jurusan}
                      </td>

                      <td className="whitespace-nowrap px-3 py-2.5 text-zinc-500 dark:text-zinc-400">
                        {item.angkatan}
                      </td>

                      <td className="whitespace-nowrap px-3 py-2.5">
                        <span className="inline-flex items-center gap-1.5 font-medium text-zinc-600 dark:text-zinc-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                          {item.namaTagihan}
                        </span>
                      </td>

                      <td
                        className={`whitespace-nowrap px-3 py-2.5 text-right font-semibold ${
                          isPaid
                            ? "text-teal-700 dark:text-teal-300"
                            : "text-zinc-400"
                        }`}
                      >
                        {rupiah(item.dibayar)}
                      </td>

                      <td
                        className={`whitespace-nowrap px-3 py-2.5 text-right font-semibold ${
                          hasRemaining
                            ? "text-rose-600 dark:text-rose-300"
                            : "text-zinc-400"
                        }`}
                      >
                        {rupiah(item.sisa)}
                      </td>

                      <td className="whitespace-nowrap px-3 py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold ${statusStyle.className}`}
                        >
                          {statusStyle.icon}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2 text-[10px] text-zinc-400 dark:border-zinc-800">
          <span>
            Menampilkan{" "}
            <strong className="text-zinc-600 dark:text-zinc-300">
              {filteredData.length}
            </strong>{" "}
            data
          </span>

          <span className="hidden sm:block">
            Geser tabel ke samping untuk melihat semua kolom
          </span>
        </div>
      </div>
    </div>
  );
}
