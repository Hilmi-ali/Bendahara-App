import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import db from "../firebase/firestore";

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

    for (const student of studentSnap.docs) {
      const siswa = student.data();

      const billsSnap = await getDocs(
        collection(db, "studentBills", siswa.nis, "bills"),
      );

      let tagihan = 0;
      let dibayar = 0;
      let sisa = 0;

      billsSnap.forEach((bill) => {
        const b = bill.data();

        tagihan += Number(b.nominal || 0);
        dibayar += Number(b.dibayar || 0);
        sisa += Number(b.sisa || 0);
      });

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
    }

    /*
    =====================================
    Recent Payment
    =====================================
    */

    let recentPayments = [];

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
    } catch (err) {
      console.log(err);
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

      /*
      ================================
      Line / Area Chart
      ================================
      */

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

      /*
      ================================
      Jurusan Chart
      ================================
      */

      jurusanChart: Object.values(jurusan).map((j) => ({
        name: j.jurusan,
        Tagihan: j.tagihan,
        Dibayar: j.dibayar,
      })),

      recentPayments,
    });
  }

  return {
    summary,
    refresh: loadDashboard,
  };
}
