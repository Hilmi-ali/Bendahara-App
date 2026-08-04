import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

import db from "../firebase/firestore";

/*
COLLECTION
*/

const transactionRef = collection(db, "transactions");
const studentBillRef = collection(db, "studentBills");

export async function getStudents(filters = {}) {
  const conditions = [];

  if (filters.jurusan) {
    conditions.push(where("jurusan", "==", filters.jurusan));
  }

  if (filters.angkatan) {
    conditions.push(where("angkatan", "==", Number(filters.angkatan)));
  }

  const q =
    conditions.length > 0
      ? query(studentBillRef, ...conditions)
      : studentBillRef;

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

/*
==================================
AMBIL TAGIHAN SATU SISWA
(read hanya saat tombol Bayar)
==================================
*/

export async function getStudentBills(nis) {
  const snap = await getDocs(collection(db, "studentBills", nis, "bills"));

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/*
==================================
SIMPAN PEMBAYARAN
==================================
*/

export async function savePayment({ nis, payments }) {
  const batch = writeBatch(db);
  const parentRef = doc(db, "studentBills", nis);
  const parentSnap = await getDoc(parentRef);
  const summary = parentSnap.data();

  let totalDibayar = Number(summary.totalDibayar || 0);
  let totalPotongan = Number(summary.totalPotongan || 0);
  let totalSisa = Number(summary.totalSisa || 0);
  let jumlahBelum = Number(summary.jumlahBelumLunas || 0);

  let pembayaranTerakhir = 0;

  for (const item of payments) {
    const ref = doc(db, "studentBills", nis, "bills", item.id);

    const snap = await getDoc(ref);

    const bill = snap.data();

    const bayar = Number(item.bayar || 0);

    const potongan = Number(item.potongan || 0);

    pembayaranTerakhir += bayar;

    const dibayarBaru = Number(bill.dibayar || 0) + bayar + potongan;
    const sisaBaru = Number(bill.nominal || 0) - dibayarBaru;

    batch.update(ref, {
      dibayar: dibayarBaru,

      potongan: Number(bill.potongan || 0) + potongan,

      sisa: sisaBaru < 0 ? 0 : sisaBaru,

      status: sisaBaru <= 0 ? "Lunas" : "Belum Bayar",

      updatedAt: serverTimestamp(),
    });

    totalDibayar += bayar;

    totalPotongan += potongan;

    totalSisa -= bayar + potongan;

    if (bill.status !== "Lunas" && sisaBaru <= 0) {
      jumlahBelum--;
    }

    batch.set(doc(transactionRef), {
      nis,
      nama: summary.nama,
      jurusan: summary.jurusan,
      billId: item.id,
      namaTagihan: bill.nama,
      nominal: bayar,
      bayar,
      potongan,

      createdAt: serverTimestamp(),
    });
  }

  batch.update(parentRef, {
    totalDibayar,

    totalPotongan,

    totalSisa: totalSisa < 0 ? 0 : totalSisa,

    jumlahBelumLunas: jumlahBelum,

    status: jumlahBelum === 0 ? "Lunas" : "Belum Lunas",

    lastPayment: pembayaranTerakhir,

    lastPaymentAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

export async function getTransactions() {
  const q = query(transactionRef, orderBy("createdAt", "desc"), limit(100));

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
