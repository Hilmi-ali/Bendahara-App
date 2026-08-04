export function validateStudents(data) {
  const errors = [];

  const valid = [];

  const nisSet = new Set();

  data.forEach((student, index) => {
    const row = index + 2;

    if (!student.nis) {
      errors.push(`Baris ${row} : NIS kosong`);

      return;
    }

    if (!student.nama) {
      errors.push(`Baris ${row} : Nama kosong`);

      return;
    }

    if (!student.jurusan) {
      errors.push(`Baris ${row} : Jurusan kosong`);

      return;
    }

    if (!student.angkatan) {
      errors.push(`Baris ${row} : Angkatan kosong`);

      return;
    }

    if (nisSet.has(student.nis)) {
      errors.push(`Baris ${row} : NIS Duplicate`);

      return;
    }

    nisSet.add(student.nis);

    valid.push(student);
  });

  return {
    valid,

    errors,
  };
}
