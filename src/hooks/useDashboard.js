import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
} from "firebase/firestore";
import db from "../firebase/firestore";

const MONTH_LABELS = [
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
];

// Tahun ajaran: Juli -> Juni
function getSchoolYearRange(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Jan ... 6 = Jul
  const startYear = month >= 6 ? year : year - 1;
  const start = new Date(startYear, 6, 1);
  const end = new Date(startYear + 1, 6, 1);
  return { start, end };
}

function monthIndexFromStart(date, start) {
  return (
    (date.getFullYear() - start.getFullYear()) * 12 +
    (date.getMonth() - start.getMonth())
  );
}

export default function useDashboard() {
  const [summary, setSummary] = useState({
    totalSiswa: 0,
    totalTagihan: 0,
    totalDibayar: 0,
    totalTunggakan: 0,
    siswaNunggak: 0,

    collectionRate: 0,

    chart: [],
    jurusanChart: [],
    recentPayments: [],

    // laporan bulanan uang masuk per angkatan (Jul - Jun)
    monthlyChart: [],
    angkatanList: [],

    totalLunas: 0,
    totalBelumLunas: 0,

    topJurusan: "",
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const studentSnap = await getDocs(collection(db, "studentBills"));

    let totalTagihan = 0;
    let totalDibayar = 0;
    let totalTunggakan = 0;
    let siswaNunggak = 0;

    const jurusan = {};
    // dipakai untuk mapping nis -> angkatan tanpa query tambahan,
    // karena studentSnap sudah pasti diambil untuk hitung total di atas
    const siswaAngkatanMap = {};

    studentSnap.forEach((student) => {
      const siswa = student.data();

      siswaAngkatanMap[siswa.nis] = siswa.angkatan || "Lainnya";

      const dibayarTunai = Number(siswa.totalDibayar || 0);
      const potongan = Number(siswa.totalPotongan || 0);
      const sisa = Number(siswa.totalSisa || 0);

      const tagihan = dibayarTunai + potongan + sisa;
      const dibayar = dibayarTunai + potongan;

      totalTagihan += tagihan;
      totalDibayar += dibayar;
      totalTunggakan += sisa;

      if (sisa > 0) siswaNunggak++;

      if (!jurusan[siswa.jurusan]) {
        jurusan[siswa.jurusan] = {
          jurusan: siswa.jurusan,
          tagihan: 0,
          dibayar: 0,
        };
      }

      jurusan[siswa.jurusan].tagihan += tagihan;
      jurusan[siswa.jurusan].dibayar += dibayar;
    });

    const { start, end } = getSchoolYearRange();
    let monthlyChart = MONTH_LABELS.map((label) => ({ name: label }));
    let angkatanList = [];
    let recentPayments = [];

    try {
      const yearTxSnap = await getDocs(
        query(
          collection(db, "transactions"),
          where("createdAt", ">=", Timestamp.fromDate(start)),
          where("createdAt", "<", Timestamp.fromDate(end)),
          orderBy("createdAt", "desc"),
        ),
      );

      // sudah terurut desc dari query, jadi tinggal ambil 5 teratas
      recentPayments = yearTxSnap.docs.slice(0, 5).map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const angkatanSet = new Set();
      const monthlyMap = {};

      yearTxSnap.forEach((doc) => {
        const t = doc.data();
        const createdAt = t.createdAt?.toDate
          ? t.createdAt.toDate()
          : new Date(t.createdAt);
        const idx = monthIndexFromStart(createdAt, start);
        if (idx < 0 || idx > 11) return;

        const angkatan = String(siswaAngkatanMap[t.nis] || "Lainnya");
        angkatanSet.add(angkatan);

        if (!monthlyMap[idx]) monthlyMap[idx] = {};
        monthlyMap[idx][angkatan] =
          (monthlyMap[idx][angkatan] || 0) + Number(t.nominal || 0);
      });

      angkatanList = Array.from(angkatanSet).sort();

      monthlyChart = MONTH_LABELS.map((label, idx) => {
        const row = { name: label };
        angkatanList.forEach((a) => {
          row[a] = monthlyMap[idx]?.[a] || 0;
        });
        return row;
      });
    } catch (err) {
      console.log(err);

      // fallback: tetap tampilkan transaksi terbaru walau laporan bulanan gagal
      try {
        const paymentSnap = await getDocs(
          query(
            collection(db, "transactions"),
            orderBy("createdAt", "desc"),
            limit(5),
          ),
        );

        recentPayments = paymentSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (err2) {
        console.log(err2);
      }
    }

    const collectionRate =
      totalTagihan === 0 ? 0 : Math.round((totalDibayar / totalTagihan) * 100);

    setSummary({
      totalSiswa: studentSnap.size,

      totalTagihan,

      totalDibayar,

      totalTunggakan,

      siswaNunggak,

      collectionRate,

      chart: [
        {
          name: "Tagihan",
          value: totalTagihan,
        },
        {
          name: "Dibayar",
          value: totalDibayar,
        },
        {
          name: "Tunggakan",
          value: totalTunggakan,
        },
      ],

      jurusanChart: Object.values(jurusan).map((j) => ({
        name: j.jurusan,
        Tagihan: j.tagihan,
        Dibayar: j.dibayar,
      })),

      monthlyChart,
      angkatanList,

      recentPayments,
    });
  }

  return {
    summary,
    refresh: loadDashboard,
  };
}
