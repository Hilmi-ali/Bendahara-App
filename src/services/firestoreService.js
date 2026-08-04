import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

import db from "../firebase/firestore";

export const firestoreService = {
  async getAll(collectionName) {
    const snapshot = await getDocs(collection(db, collectionName));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async getById(collectionName, id) {
    const snapshot = await getDoc(doc(db, collectionName, id));

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  },

  async create(collectionName, data) {
    return await addDoc(collection(db, collectionName), data);
  },

  async update(collectionName, id, data) {
    return await updateDoc(doc(db, collectionName, id), data);
  },

  async remove(collectionName, id) {
    return await deleteDoc(doc(db, collectionName, id));
  },

  async where(collectionName, field, operator, value) {
    const q = query(
      collection(db, collectionName),
      where(field, operator, value),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async latest(collectionName, jumlah = 5) {
    const q = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc"),
      limit(jumlah),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};
