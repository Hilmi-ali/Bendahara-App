import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

import * as XLSX from "xlsx";

import db from "../firebase/firestore";

/*
|--------------------------------------------------------------------------
| COLLECTION
|--------------------------------------------------------------------------
*/

const reportRef = collection(db, "studentBills");

const transactionRef = collection(db, "transactions");

/*
|--------------------------------------------------------------------------
| HELPER
|--------------------------------------------------------------------------
*/

function toNumber(value) {
  return Number(value || 0);
}

function getDateFromValue(value) {
  if (!value) return null;

  if (value?.toDate) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeJurusan(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

/*
|--------------------------------------------------------------------------
| LAPORAN SISWA
|--------------------------------------------------------------------------
|
| TIDAK DIUBAH.
|
*/

export async function getReport(filters = {}) {
  const { jurusan, angkatan } = filters;

  const conditions = [];

  if (jurusan) {
    conditions.push(where("jurusan", "==", jurusan));
  }

  if (angkatan) {
    conditions.push(where("angkatan", "==", Number(angkatan)));
  }

  const q = conditions.length > 0 ? query(reportRef, ...conditions) : reportRef;

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/*
|--------------------------------------------------------------------------
| SUMMARY LAMA
|--------------------------------------------------------------------------
|
| Tetap dipertahankan.
|
*/

export function calculateSummary(rows) {
  let totalTagihan = 0;

  let totalDibayar = 0;

  let totalPotongan = 0;

  let totalSisa = 0;

  const jurusanMap = {};

  const monthlyMap = {};

  rows.forEach((item) => {
    const tagihan = toNumber(item.totalTagihan);

    const dibayar = toNumber(item.totalDibayar);

    const potongan = toNumber(item.totalPotongan);

    const sisa = toNumber(item.totalSisa);

    totalTagihan += tagihan;

    totalDibayar += dibayar;

    totalPotongan += potongan;

    totalSisa += sisa;

    if (!jurusanMap[item.jurusan]) {
      jurusanMap[item.jurusan] = {
        jurusan: item.jurusan,
        dibayar: 0,
        sisa: 0,
      };
    }

    jurusanMap[item.jurusan].dibayar += dibayar;

    jurusanMap[item.jurusan].sisa += sisa;

    const bulan =
      item.lastPaymentAt?.toDate?.().toLocaleString("id-ID", {
        month: "short",
      }) || "-";

    if (!monthlyMap[bulan]) {
      monthlyMap[bulan] = {
        bulan,
        total: 0,
      };
    }

    monthlyMap[bulan].total += dibayar;
  });

  return {
    totalTagihan,

    totalDibayar,

    totalPotongan,

    totalSisa,

    jumlahTransaksi: rows.length,

    monthlySummary: {
      total: totalDibayar,
      count: rows.length,
    },

    yearlySummary: {
      total: totalDibayar,
      count: rows.length,
    },

    monthlyChart: Object.values(monthlyMap),

    jurusanChart: Object.values(jurusanMap),

    topStudents: [...rows]
      .sort((a, b) => toNumber(b.totalDibayar) - toNumber(a.totalDibayar))
      .slice(0, 10),

    outstandingJurusan: Object.values(jurusanMap),
  };
}

/*
|--------------------------------------------------------------------------
| RANGE PERIODE
|--------------------------------------------------------------------------
*/

function getPeriodRange({ period, month, year }) {
  if (period === "monthly") {
    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);

    const endDate = new Date(year, month, 1, 0, 0, 0, 0);

    return {
      startDate,
      endDate,
    };
  }

  const startDate = new Date(year, 0, 1, 0, 0, 0, 0);

  const endDate = new Date(year + 1, 0, 1, 0, 0, 0, 0);

  return {
    startDate,
    endDate,
  };
}

/*
|--------------------------------------------------------------------------
| TRANSAKSI PERIODE
|--------------------------------------------------------------------------
|
| Sumber "TERBAYARKAN".
|
| Hanya transaksi dalam periode yang dipilih.
|
*/

async function getTransactionsByPeriod({ period, month, year, jurusan }) {
  const { startDate, endDate } = getPeriodRange({
    period,
    month,
    year,
  });

  const conditions = [
    where("createdAt", ">=", Timestamp.fromDate(startDate)),

    where("createdAt", "<", Timestamp.fromDate(endDate)),
  ];

  if (jurusan) {
    conditions.push(where("jurusan", "==", jurusan));
  }

  const q = query(transactionRef, ...conditions);

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/*
|--------------------------------------------------------------------------
| SEMUA ITEM TAGIHAN
|--------------------------------------------------------------------------
*/

async function getAllBillItems() {
  const billsQuery = collectionGroup(db, "bills");

  const snap = await getDocs(billsQuery);

  return snap.docs.map((doc) => ({
    id: doc.id,

    ...doc.data(),

    /*
     * /studentBills/{nis}/bills/{billId}
     *
     * Parent kedua = NIS
     */
    nis: doc.ref.parent?.parent?.id || "",
  }));
}

/*
|--------------------------------------------------------------------------
| LAPORAN KEUANGAN
|--------------------------------------------------------------------------
|
| Struktur:
|
| {
|   namaTagihan,
|
|   AKL: {
|     nominalSiswa,
|     totalTagihan,
|     terbayarkan,
|     sisa
|   },
|
|   TJKT: {
|     nominalSiswa,
|     totalTagihan,
|     terbayarkan,
|     sisa
|   }
| }
|
|--------------------------------------------------------------------------
*/

export async function getFinancialReport({
  period = "monthly",

  month = new Date().getMonth() + 1,

  year = new Date().getFullYear(),

  jurusan = "",
} = {}) {
  /*
   * =========================================================
   * AMBIL DATA
   * =========================================================
   *
   * Kita membutuhkan:
   *
   * 1. Transaksi
   *    -> terbayarkan pada periode
   *
   * 2. Item studentBills
   *    -> nominal, total tagihan, sisa
   *
   * 3. Laporan siswa
   *    -> mapping NIS -> jurusan
   *
   */

  const [transactions, billItems, studentReports] = await Promise.all([
    getTransactionsByPeriod({
      period,
      month,
      year,
      jurusan,
    }),

    getAllBillItems(),

    /*
     * getReport() sudah merupakan data
     * studentBills yang digunakan laporan.
     *
     * Kita manfaatkan untuk mengetahui
     * jurusan setiap NIS.
     */
    getReport(
      jurusan
        ? {
            jurusan,
          }
        : {},
    ),
  ]);

  /*
   * =========================================================
   * MAP NIS -> JURUSAN
   * =========================================================
   */

  const studentJurusanMap = {};

  studentReports.forEach((student) => {
    const nis = String(student.nis || student.id || "").trim();

    const value = normalizeJurusan(student.jurusan);

    if (nis && (value === "AKL" || value === "TJKT")) {
      studentJurusanMap[nis] = value;
    }
  });

  /*
   * =========================================================
   * MAP TERBAYARKAN
   * =========================================================
   */

  const paidMap = {};

  transactions.forEach((transaction) => {
    const namaTagihan =
      transaction.namaTagihan ||
      transaction.nama ||
      transaction.billName ||
      "Tanpa Nama";

    const normalizedName = String(namaTagihan).trim();

    /*
     * Prioritas jurusan:
     *
     * 1. transaction.jurusan
     * 2. studentJurusanMap berdasarkan NIS
     */

    let transactionJurusan = normalizeJurusan(transaction.jurusan);

    if (transactionJurusan !== "AKL" && transactionJurusan !== "TJKT") {
      const transactionNis = String(transaction.nis || "").trim();

      transactionJurusan = studentJurusanMap[transactionNis] || "";
    }

    if (transactionJurusan !== "AKL" && transactionJurusan !== "TJKT") {
      return;
    }

    if (jurusan && transactionJurusan !== normalizeJurusan(jurusan)) {
      return;
    }

    if (!paidMap[normalizedName]) {
      paidMap[normalizedName] = {
        AKL: 0,
        TJKT: 0,
      };
    }

    paidMap[normalizedName][transactionJurusan] += toNumber(transaction.bayar);
  });

  /*
   * =========================================================
   * MAP TAGIHAN
   * =========================================================
   */

  const billMap = {};

  billItems.forEach((bill) => {
    const namaTagihan =
      bill.nama || bill.namaTagihan || bill.billName || "Tanpa Nama";

    const normalizedName = String(namaTagihan).trim();

    /*
     * Ambil jurusan dari:
     *
     * 1. bill.jurusan jika ada
     * 2. mapping NIS dari laporan siswa
     */

    let billJurusan = normalizeJurusan(
      bill.jurusan || bill.program || bill.jurusanNama,
    );

    if (billJurusan !== "AKL" && billJurusan !== "TJKT") {
      const nis = String(bill.nis || "").trim();

      billJurusan = studentJurusanMap[nis] || "";
    }

    /*
     * Tidak boleh menebak jurusan.
     */

    if (billJurusan !== "AKL" && billJurusan !== "TJKT") {
      return;
    }

    if (jurusan && billJurusan !== normalizeJurusan(jurusan)) {
      return;
    }

    if (!billMap[normalizedName]) {
      billMap[normalizedName] = {
        AKL: {
          nominalSiswa: 0,
          totalTagihan: 0,
          sisa: 0,
          jumlahSiswa: 0,
        },

        TJKT: {
          nominalSiswa: 0,
          totalTagihan: 0,
          sisa: 0,
          jumlahSiswa: 0,
        },
      };
    }

    const target = billMap[normalizedName][billJurusan];

    const nominal = toNumber(bill.nominal);

    const sisa = toNumber(bill.sisa);

    /*
     * Nominal/Siswa:
     *
     * Jika semua siswa mempunyai
     * nominal sama, nilainya sama.
     *
     * Jika ada variasi nominal,
     * kita tidak menjumlahkannya.
     * Nilai yang ditampilkan adalah
     * nominal pertama yang ditemukan.
     */

    if (target.nominalSiswa === 0 && nominal > 0) {
      target.nominalSiswa = nominal;
    }

    target.totalTagihan += nominal;

    target.sisa += sisa;

    target.jumlahSiswa += 1;
  });

  /*
   * =========================================================
   * GABUNGKAN ITEM
   * =========================================================
   */

  const names = new Set([...Object.keys(paidMap), ...Object.keys(billMap)]);

  const result = [...names]
    .map((namaTagihan) => {
      const paid = paidMap[namaTagihan] || {
        AKL: 0,
        TJKT: 0,
      };

      const bills = billMap[namaTagihan] || {
        AKL: {
          nominalSiswa: 0,
          totalTagihan: 0,
          sisa: 0,
          jumlahSiswa: 0,
        },

        TJKT: {
          nominalSiswa: 0,
          totalTagihan: 0,
          sisa: 0,
          jumlahSiswa: 0,
        },
      };

      return {
        namaTagihan,

        AKL: {
          nominalSiswa: toNumber(bills.AKL.nominalSiswa),

          totalTagihan: toNumber(bills.AKL.totalTagihan),

          terbayarkan: toNumber(paid.AKL),

          sisa: toNumber(bills.AKL.sisa),

          jumlahSiswa: bills.AKL.jumlahSiswa || 0,
        },

        TJKT: {
          nominalSiswa: toNumber(bills.TJKT.nominalSiswa),

          totalTagihan: toNumber(bills.TJKT.totalTagihan),

          terbayarkan: toNumber(paid.TJKT),

          sisa: toNumber(bills.TJKT.sisa),

          jumlahSiswa: bills.TJKT.jumlahSiswa || 0,
        },
      };
    })
    .sort((a, b) =>
      a.namaTagihan.localeCompare(b.namaTagihan, "id", {
        sensitivity: "base",
      }),
    );

  return result;
}

/*
|--------------------------------------------------------------------------
| EXPORT EXCEL
|--------------------------------------------------------------------------
|
| Design:
|
| Sheet 1:
| Laporan Keuangan
|
| Sheet 2:
| Ringkasan
|
|--------------------------------------------------------------------------
*/

export async function exportFinancialReportExcel({
  data = [],

  period = "monthly",

  month = new Date().getMonth() + 1,

  year = new Date().getFullYear(),

  jurusan = "",
} = {}) {
  const workbook = XLSX.utils.book_new();

  /*
   * =========================================================
   * LABEL PERIODE
   * =========================================================
   */

  const periodLabel =
    period === "monthly"
      ? new Date(year, month - 1, 1).toLocaleString("id-ID", {
          month: "long",
          year: "numeric",
        })
      : `Tahun ${year}`;

  const jurusanLabel = jurusan || "AKL & TJKT";

  /*
   * =========================================================
   * HITUNG TOTAL
   * =========================================================
   */

  const total = {
    aklTagihan: 0,
    aklMasuk: 0,
    aklSisa: 0,

    tjktTagihan: 0,
    tjktMasuk: 0,
    tjktSisa: 0,
  };

  data.forEach((item) => {
    total.aklTagihan += toNumber(item.AKL?.totalTagihan);

    total.aklMasuk += toNumber(item.AKL?.terbayarkan);

    total.aklSisa += toNumber(item.AKL?.sisa);

    total.tjktTagihan += toNumber(item.TJKT?.totalTagihan);

    total.tjktMasuk += toNumber(item.TJKT?.terbayarkan);

    total.tjktSisa += toNumber(item.TJKT?.sisa);
  });

  const totalTagihan = total.aklTagihan + total.tjktTagihan;

  const totalMasuk = total.aklMasuk + total.tjktMasuk;

  const totalSisa = total.aklSisa + total.tjktSisa;

  /*
   * =========================================================
   * SHEET UTAMA
   * =========================================================
   */

  const rows = [];

  /*
   * TITLE
   */

  rows.push(["LAPORAN KEUANGAN SEKOLAH"]);

  rows.push(["Rekap berdasarkan item tagihan"]);

  rows.push(["Periode", periodLabel]);

  rows.push(["Jurusan", jurusanLabel]);

  rows.push([]);

  /*
   * HEADER BERTINGKAT
   */

  rows.push([
    "No",
    "Item Tagihan",

    "AKL",
    "",
    "",
    "",

    "TJKT",
    "",
    "",
    "",

    "TOTAL KESELURUHAN",
    "",
    "",
  ]);

  rows.push([
    "",
    "",

    "Nominal / Siswa",
    "Total Tagihan",
    "Terbayarkan",
    "Sisa",

    "Nominal / Siswa",
    "Total Tagihan",
    "Terbayarkan",
    "Sisa",

    "Total Tagihan",
    "Terbayarkan",
    "Sisa",
  ]);

  /*
   * DATA
   */

  data.forEach((item, index) => {
    const akl = item.AKL || {};

    const tjkt = item.TJKT || {};

    const aklTagihan = toNumber(akl.totalTagihan);

    const aklMasuk = toNumber(akl.terbayarkan);

    const aklSisa = toNumber(akl.sisa);

    const tjktTagihan = toNumber(tjkt.totalTagihan);

    const tjktMasuk = toNumber(tjkt.terbayarkan);

    const tjktSisa = toNumber(tjkt.sisa);

    const itemTagihan = aklTagihan + tjktTagihan;

    const itemMasuk = aklMasuk + tjktMasuk;

    const itemSisa = aklSisa + tjktSisa;

    rows.push([
      index + 1,

      item.namaTagihan,

      /*
       * AKL
       */

      toNumber(akl.nominalSiswa),

      aklTagihan,

      aklMasuk,

      aklSisa,

      /*
       * TJKT
       */

      toNumber(tjkt.nominalSiswa),

      tjktTagihan,

      tjktMasuk,

      tjktSisa,

      /*
       * TOTAL
       */

      itemTagihan,

      itemMasuk,

      itemSisa,
    ]);
  });

  /*
   * TOTAL
   */

  rows.push([]);

  rows.push([
    "",
    "TOTAL KESELURUHAN",

    "",

    total.aklTagihan,

    total.aklMasuk,

    total.aklSisa,

    "",

    total.tjktTagihan,

    total.tjktMasuk,

    total.tjktSisa,

    totalTagihan,

    totalMasuk,

    totalSisa,
  ]);

  /*
   * =========================================================
   * WORKSHEET
   * =========================================================
   */

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  /*
   * =========================================================
   * MERGE TITLE
   * =========================================================
   */

  worksheet["!merges"] = [
    /*
     * Title
     */

    {
      s: {
        r: 0,
        c: 0,
      },

      e: {
        r: 0,
        c: 12,
      },
    },

    /*
     * Subtitle
     */

    {
      s: {
        r: 1,
        c: 0,
      },

      e: {
        r: 1,
        c: 12,
      },
    },

    /*
     * AKL
     */

    {
      s: {
        r: 5,
        c: 2,
      },

      e: {
        r: 5,
        c: 5,
      },
    },

    /*
     * TJKT
     */

    {
      s: {
        r: 5,
        c: 6,
      },

      e: {
        r: 5,
        c: 9,
      },
    },

    /*
     * TOTAL
     */

    {
      s: {
        r: 5,
        c: 10,
      },

      e: {
        r: 5,
        c: 12,
      },
    },
  ];

  /*
   * =========================================================
   * COLUMN WIDTH
   * =========================================================
   */

  worksheet["!cols"] = [
    {
      wch: 6,
    },

    {
      wch: 30,
    },

    {
      wch: 18,
    },

    {
      wch: 20,
    },

    {
      wch: 20,
    },

    {
      wch: 18,
    },

    {
      wch: 18,
    },

    {
      wch: 20,
    },

    {
      wch: 20,
    },

    {
      wch: 18,
    },

    {
      wch: 20,
    },

    {
      wch: 20,
    },

    {
      wch: 20,
    },
  ];

  /*
   * =========================================================
   * FREEZE HEADER
   * =========================================================
   */

  worksheet["!freeze"] = {
    xSplit: 2,
    ySplit: 7,
  };

  /*
   * =========================================================
   * AUTOFILTER
   * =========================================================
   */

  worksheet["!autofilter"] = {
    ref: `A7:M${7 + data.length}`,
  };

  /*
   * =========================================================
   * FORMAT ANGKA
   * =========================================================
   */

  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  /*
   * Kolom angka:
   *
   * C-M
   */

  for (let row = 0; row <= range.e.r; row++) {
    for (let col = 2; col <= 12; col++) {
      const cell =
        worksheet[
          XLSX.utils.encode_cell({
            r: row,
            c: col,
          })
        ];

      if (cell && typeof cell.v === "number") {
        cell.z = '"Rp" #,##0';
      }
    }
  }

  /*
   * =========================================================
   * STYLE
   * =========================================================
   *
   * SheetJS community edition tidak mempunyai
   * styling Excel yang selengkap ExcelJS.
   *
   * Namun kita tetap menambahkan beberapa
   * properti kompatibilitas.
   */

  /*
   * Alignment
   */

  for (let row = 7; row <= range.e.r; row++) {
    for (let col = 0; col <= 12; col++) {
      const cell =
        worksheet[
          XLSX.utils.encode_cell({
            r: row,
            c: col,
          })
        ];

      if (!cell) continue;

      if (col >= 2) {
        cell.s = {
          alignment: {
            horizontal: "right",
          },
        };
      } else {
        cell.s = {
          alignment: {
            horizontal: "left",
          },
        };
      }
    }
  }

  /*
   * =========================================================
   * SHEET RINGKASAN
   * =========================================================
   *
   * Sheet ini dibuat agar ketika kepala sekolah/
   * bendahara membuka Excel, informasi utama
   * langsung terlihat.
   */

  const summaryRows = [
    ["RINGKASAN LAPORAN KEUANGAN"],

    ["Periode", periodLabel],

    ["Jurusan", jurusanLabel],

    [],

    ["JURUSAN", "TOTAL TAGIHAN", "TERBAYARKAN", "SISA"],

    ["AKL", total.aklTagihan, total.aklMasuk, total.aklSisa],

    ["TJKT", total.tjktTagihan, total.tjktMasuk, total.tjktSisa],

    ["TOTAL", totalTagihan, totalMasuk, totalSisa],

    [],

    ["JUMLAH ITEM TAGIHAN", data.length],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);

  /*
   * Merge title
   */

  summarySheet["!merges"] = [
    {
      s: {
        r: 0,
        c: 0,
      },

      e: {
        r: 0,
        c: 3,
      },
    },
  ];

  /*
   * Width
   */

  summarySheet["!cols"] = [
    {
      wch: 28,
    },

    {
      wch: 25,
    },

    {
      wch: 25,
    },

    {
      wch: 25,
    },
  ];

  /*
   * Number format
   */

  const summaryRange = XLSX.utils.decode_range(summarySheet["!ref"]);

  for (let row = 0; row <= summaryRange.e.r; row++) {
    for (let col = 1; col <= 3; col++) {
      const cell =
        summarySheet[
          XLSX.utils.encode_cell({
            r: row,
            c: col,
          })
        ];

      if (cell && typeof cell.v === "number") {
        cell.z = '"Rp" #,##0';
      }
    }
  }

  /*
   * =========================================================
   * APPEND SHEETS
   * =========================================================
   */

  XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");

  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Keuangan");

  /*
   * =========================================================
   * FILE NAME
   * =========================================================
   */

  const safePeriod =
    period === "monthly"
      ? `${year}-${String(month).padStart(2, "0")}`
      : `${year}`;

  const safeJurusan = jurusan ? `-${jurusan}` : "";

  const fileName = `Laporan-Keuangan-${safePeriod}${safeJurusan}.xlsx`;

  /*
   * =========================================================
   * DOWNLOAD
   * =========================================================
   */

  XLSX.writeFile(workbook, fileName);

  return {
    success: true,
    fileName,
  };
}

/*
|--------------------------------------------------------------------------
| BACKWARD COMPATIBILITY
|--------------------------------------------------------------------------
|
| Fungsi lama tetap tersedia.
|
*/

export async function exportReportExcel(rows, filters = {}) {
  return exportFinancialReportExcel({
    data: rows,

    period: filters.period || "monthly",

    month: filters.month || new Date().getMonth() + 1,

    year: filters.year || new Date().getFullYear(),

    jurusan: filters.jurusan || "",
  });
}
