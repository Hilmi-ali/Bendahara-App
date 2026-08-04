import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

import db from "../firebase/firestore";

const billRef = collection(db, "bills");
const studentRef = collection(db, "students");

const MAX_BATCH = 450;

/*
===================================================
Get Bills
===================================================
*/

export async function getBills() {
  const snap = await getDocs(billRef);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/*
===================================================
Preview
===================================================
*/

export async function previewBillPackage({ jurusan, angkatan, items }) {
  const q = query(
    studentRef,
    where("jurusan", "==", jurusan),
    where("angkatan", "==", angkatan),
  );

  const snap = await getDocs(q);

  const studentCount = snap.size;
  const billCount = items.length;

  const totalNominal = items.reduce(
    (total, item) => total + Number(item.nominal || 0),
    0,
  );

  // 1 dokumen parent + N dokumen tagihan untuk setiap siswa
  const totalWrite = studentCount + studentCount * billCount;

  return {
    studentCount,
    billCount,
    totalNominal,
    totalWrite,
  };
}

/*
===================================================
Create Package
===================================================
*/

export async function createBillPackage(data, onProgress = () => {}) {
  const { jurusan, angkatan, items } = data;

  /*
  ======================================
  CEK DUPLIKAT
  ======================================
  */

  const cek = query(
    billRef,
    where("jurusan", "==", jurusan),
    where("angkatan", "==", angkatan),
  );

  const exist = await getDocs(cek);

  if (!exist.empty) {
    throw new Error(`Paket ${jurusan} ${angkatan} sudah ada.`);
  }

  /*
  ======================================
  AMBIL SISWA
  ======================================
  */

  const q = query(
    studentRef,
    where("jurusan", "==", jurusan),
    where("angkatan", "==", angkatan),
  );

  const students = await getDocs(q);

  console.log("===== DEBUG SISWA =====");
  console.log("Jurusan:", jurusan);
  console.log("Angkatan:", angkatan);
  console.log("Jumlah siswa:", students.size);

  students.forEach((doc) => {
    console.log(doc.id, doc.data());
  });

  if (students.empty) {
    throw new Error("Tidak ada siswa ditemukan.");
  }

  /*
  ======================================
  SIMPAN MASTER TAGIHAN
  ======================================
  */

  const paketId = jurusan + "-" + angkatan + "-" + Date.now();

  let batch = writeBatch(db);

  let operation = 0;

  const commitBatch = async () => {
    if (operation === 0) return;

    await batch.commit();

    batch = writeBatch(db);

    operation = 0;
  };

  const billDocs = [];

  let totalNominalPaket = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.nama) continue;

    const ref = doc(billRef);

    const nominal = Number(item.nominal);

    billDocs.push({
      id: ref.id,
      nama: item.nama,
      nominal,
    });

    totalNominalPaket += nominal;

    batch.set(ref, {
      paketId,

      jurusan,

      angkatan,

      nama: item.nama,

      nominal: Number(item.nominal),

      urutan: i + 1,

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    });

    operation++;

    if (operation >= MAX_BATCH) {
      await commitBatch();
      console.log("Master tagihan berhasil disimpan");
    }
  }

  await commitBatch();
  console.log("Master tagihan berhasil disimpan");

  /*
  ======================================
  GENERATE TAGIHAN SISWA
  ======================================
  */

  const studentsSnap = await getDocs(
    query(
      studentRef,
      where("jurusan", "==", jurusan),
      where("angkatan", "==", Number(angkatan)),
    ),
  );

  if (studentsSnap.empty) {
    throw new Error("Tidak ada siswa yang sesuai.");
  }

  let batchCount = 0;
  let batchGenerate = writeBatch(db);

  let progress = 0;

  for (const student of studentsSnap.docs) {
    const siswa = student.data();

    // parent studentBills/{nis}
    const parentRef = doc(db, "studentBills", siswa.nis);

    batchGenerate.set(
      parentRef,
      {
        nis: siswa.nis,
        nama: siswa.nama,
        jurusan: siswa.jurusan,
        angkatan: siswa.angkatan,

        totalTagihan: Number(totalNominalPaket),
        totalDibayar: 0,
        totalPotongan: 0,
        totalSisa: Number(totalNominalPaket),

        jumlahTagihan: billDocs.length,
        jumlahBelumLunas: billDocs.length,

        status: "Belum Lunas",

        lastPayment: 0,
        lastPaymentAt: null,

        updatedAt: serverTimestamp(),
      },
      { merge: false },
    );

    batchCount++;

    for (const bill of billDocs) {
      const billRef = doc(collection(db, "studentBills", siswa.nis, "bills"));

      batchGenerate.set(billRef, {
        paketId,

        billId: bill.id,

        nama: bill.nama,

        nominal: Number(bill.nominal),

        dibayar: 0,

        potongan: 0,

        sisa: Number(bill.nominal),

        status: "Belum Bayar",

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      });

      batchCount++;

      if (batchCount >= 450) {
        await batchGenerate.commit();

        batchGenerate = writeBatch(db);

        batchCount = 0;
      }
    }

    progress++;

    onProgress({
      current: progress,
      total: studentsSnap.size,
      percent: Math.round((progress / studentsSnap.size) * 100),
    });
  }

  if (batchCount > 0) {
    await batchGenerate.commit();
  }
}
