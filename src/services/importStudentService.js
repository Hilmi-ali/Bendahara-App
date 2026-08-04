import { writeBatch, doc, serverTimestamp } from "firebase/firestore";

import db from "../firebase/firestore";

export async function importStudents(students) {
  const batch = writeBatch(db);

  students.forEach((student) => {
    batch.set(
      doc(db, "students", student.nis),

      {
        ...student,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      },

      {
        merge: true,
      },
    );
  });

  await batch.commit();
}
