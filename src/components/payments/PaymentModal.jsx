import { useEffect, useMemo, useState } from "react";
import { HiOutlineClock, HiOutlineInboxStack, HiXMark } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";

import Button from "../ui/Button";
import { getStudentBills, savePayment } from "../../services/paymentService";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function formatRupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function formatInputRupiah(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return `Rp ${Number(digits).toLocaleString("id-ID")}`;
}

function parseInputRupiah(value) {
  return (
    Number(
      String(value ?? "")
        .replace(/\./g, "")
        .replace(/\D/g, ""),
    ) || 0
  );
}

function sanitizeFileName(name = "") {
  return String(name)
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, "_")
    .trim();
}

export function generateStudentBillPDF(student, bills) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const sortedBills = [...bills].sort((a, b) =>
    String(a.nama || "").localeCompare(String(b.nama || ""), "id", {
      sensitivity: "base",
    }),
  );

  const totalNominal = sortedBills.reduce(
    (sum, bill) => sum + Number(bill.nominal || 0),
    0,
  );

  const totalDibayar = sortedBills.reduce(
    (sum, bill) => sum + Number(bill.dibayar || 0),
    0,
  );

  const totalPotongan = sortedBills.reduce(
    (sum, bill) => sum + Number(bill.potongan || 0),
    0,
  );

  const totalSisa = sortedBills.reduce(
    (sum, bill) => sum + Number(bill.sisa || 0),
    0,
  );

  const jumlahLunas = sortedBills.filter(
    (bill) => bill.status === "Lunas",
  ).length;

  const jumlahBelumLunas = sortedBills.length - jumlahLunas;

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("RINCIAN TAGIHAN SISWA", pageWidth / 2, 18, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Rincian pembayaran dan sisa tagihan siswa", pageWidth / 2, 24, {
    align: "center",
  });

  const identityY = 34;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  doc.text("Nama", 15, identityY);
  doc.text("NIS", 15, identityY + 6);
  doc.text("Jurusan", 15, identityY + 12);
  doc.text("Angkatan", 15, identityY + 18);

  doc.setFont("helvetica", "normal");

  doc.text(`: ${student?.nama || "-"}`, 45, identityY);
  doc.text(`: ${student?.nis || "-"}`, 45, identityY + 6);
  doc.text(`: ${student?.jurusan || "-"}`, 45, identityY + 12);
  doc.text(`: ${student?.angkatan || "-"}`, 45, identityY + 18);

  const now = new Date();

  const tanggalCetak = now.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  doc.setFont("helvetica", "bold");
  doc.text("Tgl", pageWidth - 70, identityY);

  doc.setFont("helvetica", "normal");
  doc.text(`: ${tanggalCetak}`, pageWidth - 70, identityY + 6);

  const tableRows = sortedBills.map((bill, index) => [
    index + 1,
    `${bill.nama || "-"}\nID: ${bill.id || "-"}`,
    formatRupiah(bill.nominal),
    formatRupiah(bill.dibayar),
    formatRupiah(bill.potongan),
    formatRupiah(bill.sisa),
    bill.status === "Lunas" ? "LUNAS" : "BELUM LUNAS",
  ]);

  autoTable(doc, {
    startY: identityY + 26,

    head: [
      [
        "No",
        "Item Tagihan",
        "Nominal",
        "Dibayar",
        "Potongan",
        "Sisa",
        "Status",
      ],
    ],

    body: tableRows,

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 3,
      valign: "middle",
    },

    headStyles: {
      fontStyle: "bold",
      halign: "center",
    },

    columnStyles: {
      0: {
        halign: "center",
        cellWidth: 12,
      },

      1: {
        halign: "left",
        cellWidth: 62,
      },

      2: {
        halign: "right",
        cellWidth: 37,
      },

      3: {
        halign: "right",
        cellWidth: 37,
      },

      4: {
        halign: "right",
        cellWidth: 37,
      },

      5: {
        halign: "right",
        cellWidth: 37,
      },

      6: {
        halign: "center",
        cellWidth: 30,
      },
    },

    didParseCell(data) {
      if (data.section === "body" && data.column.index === 6) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  let finalY = doc.lastAutoTable?.finalY || identityY + 35;

  if (finalY > 175) {
    doc.addPage();
    finalY = 20;
  }

  const summaryY = finalY + 12;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  doc.text("RINGKASAN", 15, summaryY);

  doc.setFont("helvetica", "normal");

  doc.text(`Total Tagihan : ${formatRupiah(totalNominal)}`, 15, summaryY + 7);

  doc.text(`Total Dibayar : ${formatRupiah(totalDibayar)}`, 15, summaryY + 14);

  doc.text(
    `Total Potongan : ${formatRupiah(totalPotongan)}`,
    15,
    summaryY + 21,
  );

  doc.setFont("helvetica", "bold");

  doc.text(`Total Sisa : ${formatRupiah(totalSisa)}`, 15, summaryY + 28);

  doc.setFont("helvetica", "normal");

  doc.text(`Tagihan Lunas : ${jumlahLunas}`, 115, summaryY + 7);

  doc.text(`Belum Lunas : ${jumlahBelumLunas}`, 115, summaryY + 14);

  doc.setFont("helvetica", "bold");

  doc.text(
    totalSisa > 0
      ? "Status : MASIH MEMILIKI TUNGGAKAN"
      : "Status : SELURUH TAGIHAN LUNAS",
    115,
    summaryY + 24,
  );

  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    "Dokumen ini dibuat secara otomatis oleh sistem pembayaran.",
    pageWidth / 2,
    pageHeight - 10,
    {
      align: "center",
    },
  );

  const safeName = sanitizeFileName(student?.nama || "Siswa");

  const fileName = `Rincian_Tagihan_${safeName}.pdf`;

  doc.save(fileName);

  return fileName;
}

export default function PaymentModal({ open, onClose, student, onSuccess }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [paymentInputs, setPaymentInputs] = useState({});

  useEffect(() => {
    if (!open || !student?.nis) {
      setBills([]);
      setPaymentInputs({});
      return;
    }

    let cancelled = false;

    async function loadBills() {
      setLoading(true);

      try {
        const data = await getStudentBills(student.nis);

        if (cancelled) return;

        const sorted = [...data].sort((a, b) =>
          String(a.nama || "").localeCompare(String(b.nama || ""), "id", {
            sensitivity: "base",
          }),
        );

        setBills(sorted);

        const initialInputs = {};

        sorted.forEach((bill) => {
          initialInputs[bill.id] = {
            bayar: "",
            potongan: "",
          };
        });

        setPaymentInputs(initialInputs);
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          alert(err.message || "Gagal mengambil data tagihan.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBills();

    return () => {
      cancelled = true;
    };
  }, [open, student?.nis]);

  function handleInputChange(id, field, value) {
    const numericValue = String(value ?? "").replace(/\D/g, "");

    setPaymentInputs((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: numericValue,
      },
    }));
  }

  const totalInputBayar = useMemo(
    () =>
      Object.values(paymentInputs).reduce(
        (sum, item) => sum + Number(item?.bayar || 0),
        0,
      ),
    [paymentInputs],
  );

  const totalInputPotongan = useMemo(
    () =>
      Object.values(paymentInputs).reduce(
        (sum, item) => sum + Number(item?.potongan || 0),
        0,
      ),
    [paymentInputs],
  );

  const totalTagihan = useMemo(
    () => bills.reduce((sum, bill) => sum + Number(bill.nominal || 0), 0),
    [bills],
  );

  const totalDibayar = useMemo(
    () => bills.reduce((sum, bill) => sum + Number(bill.dibayar || 0), 0),
    [bills],
  );

  const totalSisa = useMemo(
    () => bills.reduce((sum, bill) => sum + Number(bill.sisa || 0), 0),
    [bills],
  );

  async function handleSubmit() {
    const payments = bills
      .map((bill) => {
        const input = paymentInputs[bill.id] || {};

        const bayar = Number(input.bayar || 0);

        const potongan = Number(input.potongan || 0);

        if (bayar <= 0 && potongan <= 0) {
          return null;
        }

        return {
          id: bill.id,
          bayar,
          potongan,
        };
      })
      .filter(Boolean);

    if (payments.length === 0) {
      alert("Masukkan jumlah pembayaran atau potongan terlebih dahulu.");
      return;
    }

    try {
      setSaving(true);

      await savePayment({
        nis: student.nis,
        payments,
      });

      alert("Pembayaran berhasil disimpan.");

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);

      alert(err.message || "Gagal menyimpan pembayaran.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSharePDF() {
    if (!student?.nis || !bills.length) {
      alert("Data tagihan belum tersedia.");
      return;
    }

    try {
      setSharing(true);

      const fileName = generateStudentBillPDF(student, bills);

      const whatsappUrl =
        "https://wa.me/?text=" +
        encodeURIComponent(
          `Rincian tagihan siswa ${student.nama} telah dibuat dalam file ${fileName}.`,
        );

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);

      alert(err.message || "Gagal membuat file PDF.");
    } finally {
      setSharing(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f1013]">
        <div className="sticky top-0 z-20 shrink-0 border-b border-zinc-100 bg-white/90 px-5 py-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#131316]/90 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-500 dark:text-navy-400">
                Pembayaran
              </p>

              <h2 className="truncate text-lg font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-xl">
                {student?.nama || "-"}
              </h2>

              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-400 dark:text-zinc-500">
                <span>NIS {student?.nis || "-"}</span>

                {student?.jurusan && <span>{student.jurusan}</span>}

                {student?.angkatan && <span>Angkatan {student.angkatan}</span>}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleSharePDF}
                disabled={sharing || loading || !bills.length}
                title="Bagikan rincian tagihan melalui WhatsApp"
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-900/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
              >
                <FaWhatsapp size={16} />

                <span className="hidden sm:inline">
                  {sharing ? "Membuat PDF..." : "Bagikan"}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                aria-label="Tutup"
              >
                <HiXMark size={19} />
              </button>
            </div>
          </div>
        </div>

        <div
          className="
            modal-scroll
            min-h-0
            flex-1
            overflow-y-auto
            px-5
            py-5
            sm:px-7
          "
        >
          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-zinc-400">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-200 border-t-violet-500 dark:border-zinc-700 dark:border-t-violet-400" />

                <span className="text-sm">Memuat tagihan...</span>
              </div>
            </div>
          ) : bills.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center gap-2 text-zinc-400">
              <HiOutlineInboxStack size={30} />

              <span className="text-sm">
                Belum ada tagihan untuk siswa ini.
              </span>
            </div>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-4">
                <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900/50">
                  <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-zinc-200/40 blur-2xl dark:bg-white/5" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                        Total Tagihan
                      </p>
                    </div>

                    <p className="mt-1 text-base font-bold tracking-tight text-zinc-900 dark:text-white sm:text-lg">
                      {formatRupiah(totalTagihan)}
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900/50">
                  <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-zinc-200/40 blur-2xl dark:bg-white/5" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                        Total Dibayar
                      </p>
                    </div>
                    <p className="mt-1 text-base font-bold tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-lg">
                      {formatRupiah(totalDibayar)}
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900/50">
                  <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-zinc-200/40 blur-2xl dark:bg-white/5" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                        Sisa Tagihan
                      </p>
                    </div>

                    <p className="mt-1 text-base font-bold tracking-tight text-rose-500 dark:text-rose-400 sm:text-lg">
                      {formatRupiah(totalSisa)}
                    </p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900/50">
                  <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-zinc-200/40 blur-2xl dark:bg-white/5" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                        Jumlah Tagihan
                      </p>
                    </div>
                    <p className="mt-1 text-base font-bold tracking-tight text-zinc-900 dark:text-white sm:text-lg">
                      {bills.length} Item
                    </p>
                  </div>
                </div>
              </div>

              <div className="bill-table-scroll overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full min-w-[850px] text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-900">
                    <tr className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      <th className="px-4 py-3 text-left font-semibold">
                        Item Tagihan
                      </th>

                      <th className="px-4 py-3 text-right font-semibold">
                        Nominal
                      </th>

                      <th className="px-4 py-3 text-right font-semibold">
                        Sudah Dibayar
                      </th>

                      <th className="px-4 py-3 text-right font-semibold">
                        Sisa
                      </th>

                      <th className="px-4 py-3 text-center font-semibold">
                        Status
                      </th>

                      <th className="px-4 py-3 text-right font-semibold">
                        Pembayaran
                      </th>

                      <th className="px-4 py-3 text-right font-semibold">
                        Potongan
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {bills.map((bill) => {
                      const input = paymentInputs[bill.id] || {};

                      const sisa = Number(bill.sisa || 0);

                      return (
                        <tr
                          key={bill.id}
                          className="border-t border-zinc-100 transition-colors hover:bg-zinc-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                        >
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-zinc-900 dark:text-white">
                              {bill.nama || "-"}
                            </div>

                            <div className="mt-0.3 font-mono text-[8px] text-zinc-400 dark:text-zinc-500">
                              ID: {bill.id || "-"}
                            </div>
                          </td>

                          <td className="px-4 py-3.5 text-right text-zinc-600 dark:text-zinc-300">
                            {formatRupiah(bill.nominal)}
                          </td>

                          <td className="px-4 py-3.5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                            {formatRupiah(bill.dibayar)}
                          </td>

                          <td className="px-4 py-3.5 text-right font-medium text-rose-500 dark:text-rose-400">
                            {formatRupiah(sisa)}
                          </td>

                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                bill.status === "Lunas"
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                  : "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400"
                              }`}
                            >
                              {bill.status === "Lunas"
                                ? "Lunas"
                                : "Belum Lunas"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={formatInputRupiah(input.bayar)}
                              disabled={bill.status === "Lunas"}
                              onChange={(e) =>
                                handleInputChange(
                                  bill.id,
                                  "bayar",
                                  e.target.value,
                                )
                              }
                              placeholder="Rp 0"
                              className="w-32 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-right text-sm outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                            />
                          </td>
                          <td className="px-4 py-3.5">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={formatInputRupiah(input.potongan)}
                              disabled={bill.status === "Lunas"}
                              onChange={(e) =>
                                handleInputChange(
                                  bill.id,
                                  "potongan",
                                  e.target.value,
                                )
                              }
                              placeholder="Rp 0"
                              className="w-32 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-right text-sm outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="shrink-0 border-t border-zinc-100 bg-white/90 px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#131316]/90 sm:px-7">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <HiOutlineClock size={15} />

              <span>{bills.length} item tagihan</span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={onClose} disabled={saving}>
                Batal
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={
                  saving ||
                  loading ||
                  bills.length === 0 ||
                  (totalInputBayar <= 0 && totalInputPotongan <= 0)
                }
              >
                {saving ? "Menyimpan..." : "Simpan Pembayaran"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(161, 161, 170, 0.35) transparent;
        }

        .modal-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(161, 161, 170, 0.35);
          border-radius: 999px;
        }

        .modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(113, 113, 122, 0.55);
        }

        .bill-table-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(161, 161, 170, 0.35) transparent;
        }

        .bill-table-scroll::-webkit-scrollbar {
          height: 6px;
        }

        .bill-table-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .bill-table-scroll::-webkit-scrollbar-thumb {
          background: rgba(161, 161, 170, 0.35);
          border-radius: 999px;
        }

        .bill-table-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(113, 113, 122, 0.55);
        }
      `}</style>
    </div>
  );
}
