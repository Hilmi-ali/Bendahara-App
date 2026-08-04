import { collection, getDocs, query, where } from "firebase/firestore";

import db from "../firebase/firestore";
import * as XLSX from "xlsx";

const reportRef = collection(db, "studentBills");

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

export function calculateSummary(rows) {
  let totalTagihan = 0;
  let totalDibayar = 0;
  let totalPotongan = 0;
  let totalSisa = 0;

  const jurusanMap = {};
  const monthlyMap = {};

  rows.forEach((item) => {
    const tagihan = Number(item.totalTagihan || 0);
    const dibayar = Number(item.totalDibayar || 0);
    const potongan = Number(item.totalPotongan || 0);
    const sisa = Number(item.totalSisa || 0);

    totalTagihan += tagihan;
    totalDibayar += dibayar;
    totalPotongan += potongan;
    totalSisa += sisa;

    /*
    ===========================
    Chart Jurusan
    ===========================
    */

    if (!jurusanMap[item.jurusan]) {
      jurusanMap[item.jurusan] = {
        jurusan: item.jurusan,
        dibayar: 0,
        sisa: 0,
      };
    }

    jurusanMap[item.jurusan].dibayar += dibayar;
    jurusanMap[item.jurusan].sisa += sisa;

    /*
    ===========================
    Chart Bulanan
    ===========================
    */

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
      .sort((a, b) => b.totalDibayar - a.totalDibayar)
      .slice(0, 10),

    outstandingJurusan: Object.values(jurusanMap),
  };
}

export function exportExcel({
  data,
  type = "all",
  month = "",
  year = "",
  jurusan = "",
  angkatan = "",
  student = "",
}) {
  let rows = [...data];

  switch (type) {
    case "jurusan":
      rows = rows.filter((r) => r.jurusan === jurusan);
      break;

    case "angkatan":
      rows = rows.filter((r) => Number(r.angkatan) === Number(angkatan));
      break;

    case "student":
      rows = rows.filter((r) => r.nis === student);
      break;

    case "month":
      rows = rows.filter((r) => {
        if (!r.lastPaymentAt) return false;

        const d = r.lastPaymentAt.toDate();

        return d.getMonth() + 1 === Number(month);
      });
      break;

    case "year":
      rows = rows.filter((r) => {
        if (!r.lastPaymentAt) return false;

        const d = r.lastPaymentAt.toDate();

        return d.getFullYear() === Number(year);
      });
      break;

    default:
      break;
  }

  const excelData = rows.map((r) => ({
    NIS: r.nis,
    Nama: r.nama,
    Jurusan: r.jurusan,
    Angkatan: r.angkatan,
    "Total Tagihan": r.totalTagihan,
    Dibayar: r.totalDibayar,
    Potongan: r.totalPotongan,
    Sisa: r.totalSisa,
    Status: r.status,
  }));

  const ws = XLSX.utils.json_to_sheet(excelData);

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Laporan");

  let fileName = "Laporan";

  switch (type) {
    case "jurusan":
      fileName += "_" + jurusan;
      break;

    case "angkatan":
      fileName += "_" + angkatan;
      break;

    case "student":
      fileName += "_" + student;
      break;

    case "month":
      fileName += "_Bulan_" + month;
      break;

    case "year":
      fileName += "_Tahun_" + year;
      break;

    default:
      fileName += "_Semua";
  }

  XLSX.writeFile(wb, fileName + ".xlsx");
}
/*
=========================================
EXPORT EXCEL
=========================================
*/

export function exportReportExcel(rows = [], filters = {}) {
  const data = rows.map((item) => ({
    NIS: item.nis,
    Nama: item.nama,
    Jurusan: item.jurusan,
    Angkatan: item.angkatan,
    "Total Tagihan": item.totalTagihan,
    "Total Dibayar": item.totalDibayar,
    Potongan: item.totalPotongan,
    "Sisa Tagihan": item.totalSisa,
    Status: Number(item.totalSisa) <= 0 ? "Lunas" : "Belum Lunas",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Pembayaran");

  let filename = "Laporan";

  if (filters.jurusan) filename += `_${filters.jurusan}`;

  if (filters.angkatan) filename += `_${filters.angkatan}`;

  if (filters.bulan) filename += `_${filters.bulan}`;

  if (filters.tahun) filename += `_${filters.tahun}`;

  if (filters.nama) filename += `_${filters.nama}`;

  filename += ".xlsx";

  XLSX.writeFile(workbook, filename);
}
