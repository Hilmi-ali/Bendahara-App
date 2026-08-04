import {
  writeBatch,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import db from "../firebase/firestore";

const COLLECTION = "students";

const studentService = {
  async getAll() {
    const snapshot = await getDocs(collection(db, COLLECTION));

    return snapshot.docs.map((doc) => ({
      id: doc.id,

      ...doc.data(),
    }));
  },

  async create(student) {
    await setDoc(
      doc(db, COLLECTION, student.nis),

      {
        ...student,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      },
    );
  },

  async update(nis, data) {
    await updateDoc(
      doc(db, COLLECTION, nis),

      {
        ...data,

        updatedAt: serverTimestamp(),
      },
    );
  },

  async remove(nis) {
    await deleteDoc(doc(db, COLLECTION, nis));
  },

  async getByFilter(jurusan, angkatan) {
    let q = collection(db, COLLECTION);

    const conditions = [];

    if (jurusan) {
      conditions.push(where("jurusan", "==", jurusan));
    }

    if (angkatan) {
      conditions.push(where("angkatan", "==", angkatan));
    }

    if (conditions.length) {
      q = query(q, ...conditions);
    }

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,

      ...doc.data(),
    }));
  },
};
console.log(db);
export default studentService;
