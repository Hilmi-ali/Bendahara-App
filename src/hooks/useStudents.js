import { useEffect, useState } from "react";

import studentService from "../services/studentService";

export default function useStudents() {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  async function loadStudents() {
    setLoading(true);

    const data = await studentService.getAll();

    setStudents(data);

    setLoading(false);
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function createStudent(student) {
    await studentService.create(student);

    setStudents((prev) => [...prev, student]);
  }

  async function updateStudent(nis, data) {
    await studentService.update(nis, data);

    setStudents((prev) =>
      prev.map((student) =>
        student.nis === nis
          ? {
              ...student,

              ...data,
            }
          : student,
      ),
    );
  }

  async function deleteStudent(nis) {
    await studentService.remove(nis);

    setStudents((prev) => prev.filter((student) => student.nis !== nis));
  }

  return {
    students,

    loading,

    createStudent,

    updateStudent,

    deleteStudent,

    refresh: loadStudents,
  };
}
