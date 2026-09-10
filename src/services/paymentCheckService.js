import { collectionGroup, getDocs, collection } from "firebase/firestore";
import db from "../firebase/firestore";

async function getStudentMap() {
  const snap = await getDocs(collection(db, "studentBills"));
  const map = {};
  snap.docs.forEach((d) => {
    map[d.id] = { nis: d.id, ...d.data() };
  });
  return map;
}

/**
 * Ambil semua tagihan (dari semua siswa) yang nama-nya mengandung `keyword`
 * (mis. "ASTS", "ASAS", "Kunjungan") dan sudah ada pembayaran (dibayar > 0).
 */
export async function getPaidBillsByKeyword(keyword) {
  const [billsSnap, studentMap] = await Promise.all([
    getDocs(collectionGroup(db, "bills")),
    getStudentMap(),
  ]);

  const lowerKeyword = keyword.trim().toLowerCase();
  const result = [];

  billsSnap.forEach((docSnap) => {
    const bill = docSnap.data();
    const namaTagihan = bill.nama || "";

    if (!namaTagihan.toLowerCase().includes(lowerKeyword)) return;

    const dibayar = Number(bill.dibayar || 0);
    if (dibayar <= 0) return; // hanya yang sudah bayar, walau belum lunas

    const nis = docSnap.ref.parent.parent?.id; // studentBills/{nis}/bills/{id}
    const student = studentMap[nis] || {};

    result.push({
      billId: docSnap.id,
      nis,
      namaSiswa: student.nama || "-",
      jurusan: student.jurusan || "-",
      angkatan: student.angkatan || "-",
      namaTagihan,
      nominal: Number(bill.nominal || 0),
      dibayar,
      potongan: Number(bill.potongan || 0),
      sisa: Number(bill.sisa || 0),
      status: bill.status || "-",
    });
  });

  return result;
}
