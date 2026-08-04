import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/firestore";

const studentRef = collection(db, "students");
const studentBillRef = collection(db, "studentBills");

export async function getDashboardSummary() {
  const [studentsSnap, billSnap] = await Promise.all([
    getDocs(studentRef),
    getDocs(studentBillRef),
  ]);

  let totalTagihan = 0;
  let totalDibayar = 0;
  let totalSisa = 0;
  let siswaNunggak = 0;

  billSnap.forEach((doc) => {
    const data = doc.data();

    totalTagihan += Number(data.totalTagihan || 0);
    totalDibayar += Number(data.totalDibayar || 0);
    totalSisa += Number(data.totalSisa || 0);

    if (data.status !== "Lunas") {
      siswaNunggak++;
    }
  });

  return {
    totalSiswa: studentsSnap.size,

    totalTagihan,

    totalDibayar,

    totalTunggakan: totalSisa,

    siswaNunggak,

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
        value: totalSisa,
      },
    ],
  };
}
