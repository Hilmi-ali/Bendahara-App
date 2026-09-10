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

export async function getStudentBills(nis) {
  const snap = await getDocs(collection(db, "studentBills", nis, "bills"));

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

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

export async function cancelTransaction(trxId) {
  const trxRef = doc(db, "transactions", trxId);
  const trxSnap = await getDoc(trxRef);

  if (!trxSnap.exists()) {
    throw new Error("Transaksi tidak ditemukan.");
  }

  const trx = trxSnap.data();

  if (trx.dibatalkan) {
    throw new Error("Transaksi ini sudah pernah dibatalkan.");
  }

  const { nis, billId, bayar = 0, potongan = 0 } = trx;

  const billRef = doc(db, "studentBills", nis, "bills", billId);
  const billSnap = await getDoc(billRef);

  if (!billSnap.exists()) {
    throw new Error("Tagihan terkait tidak ditemukan (mungkin sudah dihapus).");
  }

  const bill = billSnap.data();

  const parentRef = doc(db, "studentBills", nis);
  const parentSnap = await getDoc(parentRef);

  if (!parentSnap.exists()) {
    throw new Error("Data siswa tidak ditemukan.");
  }

  const summary = parentSnap.data();

  const wasLunas = bill.status === "Lunas";

  // kembalikan nominal di level bill
  const dibayarBaru = Math.max(
    0,
    Number(bill.dibayar || 0) - Number(bayar) - Number(potongan),
  );
  const potonganBaru = Math.max(
    0,
    Number(bill.potongan || 0) - Number(potongan),
  );
  const sisaBaru = Math.max(0, Number(bill.nominal || 0) - dibayarBaru);
  const statusBaru = sisaBaru <= 0 ? "Lunas" : "Belum Bayar";

  const nowNotLunas = wasLunas && statusBaru !== "Lunas";

  // kembalikan nominal di level summary siswa
  const totalDibayarBaru = Math.max(
    0,
    Number(summary.totalDibayar || 0) - Number(bayar),
  );
  const totalPotonganBaru = Math.max(
    0,
    Number(summary.totalPotongan || 0) - Number(potongan),
  );
  const totalSisaBaruRaw =
    Number(summary.totalSisa || 0) + Number(bayar) + Number(potongan);
  const totalSisaBaru = totalSisaBaruRaw < 0 ? 0 : totalSisaBaruRaw;
  const jumlahBelumBaru =
    Number(summary.jumlahBelumLunas || 0) + (nowNotLunas ? 1 : 0);

  const batch = writeBatch(db);

  batch.update(billRef, {
    dibayar: dibayarBaru,
    potongan: potonganBaru,
    sisa: sisaBaru,
    status: statusBaru,
    updatedAt: serverTimestamp(),
  });

  batch.update(parentRef, {
    totalDibayar: totalDibayarBaru,
    totalPotongan: totalPotonganBaru,
    totalSisa: totalSisaBaru,
    jumlahBelumLunas: jumlahBelumBaru,
    status: jumlahBelumBaru === 0 ? "Lunas" : "Belum Lunas",
    updatedAt: serverTimestamp(),
  });

  batch.update(trxRef, {
    dibatalkan: true,
    cancelledAt: serverTimestamp(),
  });

  await batch.commit();

  return {
    nis,
    nama: trx.nama,
    billId,
    billName: trx.namaTagihan,
  };
}
