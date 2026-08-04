import { useMemo, useState } from "react";
import { HiPlus } from "react-icons/hi2";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import StudentTable from "../components/students/StudentTable";
import StudentModal from "../components/students/StudentModal";
import useStudents from "../hooks/useStudents";
import ImportStudentModal from "../components/students/ImportStudentModal";

import { downloadStudentTemplate } from "../services/templateStudentService";
import * as XLSX from "xlsx";
import { mapExcelData } from "../utils/excelStudentMapper";
import { validateStudents } from "../utils/excelValidator";
import { importStudents } from "../services/importStudentService";

export default function Students() {
  const {
    students,
    loading,
    createStudent,
    updateStudent,
    deleteStudent,
    refresh,
  } = useStudents();

  const [search, setSearch] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [angkatan, setAngkatan] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.nama?.toLowerCase().includes(search.toLowerCase()) ||
        s.nis?.includes(search);

      const matchJurusan = jurusan ? s.jurusan === jurusan : true;

      const matchAngkatan = angkatan ? String(s.angkatan) === angkatan : true;

      return matchSearch && matchJurusan && matchAngkatan;
    });
  }, [students, search, jurusan, angkatan]);

  const angkatanOptions = useMemo(
    () =>
      [...new Set(students.map((s) => s.angkatan))]
        .filter(Boolean)
        .sort((a, b) => b - a),
    [students],
  );

  async function handleSubmit(form) {
    if (editing) {
      await updateStudent(editing.nis, form);
    } else {
      await createStudent(form);
    }
  }

  function handleEdit(student) {
    setEditing(student);
    setModalOpen(true);
  }

  async function handleDelete(student) {
    const ok = window.confirm(`Hapus siswa ${student.nama} (${student.nis})?`);

    if (!ok) return;

    await deleteStudent(student.nis);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Data Siswa
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Kelola data siswa berdasarkan jurusan dan angkatan.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button variant="secondary" onClick={downloadStudentTemplate}>
            Download Template
          </Button>

          <Button variant="secondary" onClick={() => setImportModalOpen(true)}>
            Import Excel
          </Button>

          <Button
            icon={HiPlus}
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            Tambah Siswa
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-darkcard p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Input
            placeholder="Cari NIS atau nama siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={jurusan}
            onChange={(e) => setJurusan(e.target.value)}
            className="h-11 px-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-sm text-gray-700 dark:text-zinc-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
          >
            <option value="">Semua Jurusan</option>
            <option value="TJKT">TJKT</option>
            <option value="AKL">AKL</option>
          </select>

          <select
            value={angkatan}
            onChange={(e) => setAngkatan(e.target.value)}
            className="h-11 px-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-sm text-gray-700 dark:text-zinc-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
          >
            <option value="">Semua Angkatan</option>
            {angkatanOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-darkcard p-10 text-center">
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Memuat data siswa...
          </p>
        </div>
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      <StudentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editing}
      />

      <ImportStudentModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSelectFile={async (file) => {
          try {
            const buffer = await file.arrayBuffer();

            const workbook = XLSX.read(buffer);

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const rows = XLSX.utils.sheet_to_json(sheet);

            const mapped = mapExcelData(rows);

            const { valid, errors } = validateStudents(mapped);

            if (errors.length) {
              alert(errors.join("\n"));
              return;
            }

            await importStudents(valid);

            await refresh();
            alert(`${valid.length} siswa berhasil diimport.`);
          } catch (err) {
            console.error(err);

            alert("Import gagal.");
          }
        }}
      />
    </div>
  );
}
