import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

const jurusanOptions = ["TJKT", "AKL"];
const currentYear = new Date().getFullYear();
const angkatanOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

export default function StudentModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    nis: "",
    nisn: "",
    nama: "",
    jurusan: "TJKT",
    angkatan: currentYear,
    status: "aktif",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        nis: initialData.nis || "",
        nisn: initialData.nisn || "",
        nama: initialData.nama || "",
        jurusan: initialData.jurusan || "TJKT",
        angkatan: initialData.angkatan || currentYear,
        status: initialData.status || "aktif",
      });
    } else {
      setForm({
        nis: "",
        nisn: "",
        nama: "",
        jurusan: "TJKT",
        angkatan: currentYear,
        status: "aktif",
      });
    }
  }, [initialData, open]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "angkatan" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nis || !form.nama) return;

    await onSubmit(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-darkcard p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">
              {initialData ? "Edit Siswa" : "Tambah Siswa"}
            </h2>
            <p className="text-sm text-gray-500">
              {initialData
                ? "Perbarui data siswa."
                : "Tambahkan data siswa baru."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-300 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="NIS"
              name="nis"
              value={form.nis}
              onChange={handleChange}
              disabled={!!initialData}
              placeholder="260001"
              required
            />

            <Input
              label="NISN"
              name="nisn"
              value={form.nisn}
              onChange={handleChange}
              placeholder="009887766"
            />
          </div>

          <Input
            label="Nama Lengkap"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Andi Saputra"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="font-medium dark:text-white">Jurusan</label>
              <select
                name="jurusan"
                value={form.jurusan}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 outline-none focus:border-primary dark:text-white transition"
              >
                {jurusanOptions.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-medium dark:text-white">Angkatan</label>
              <select
                name="angkatan"
                value={form.angkatan}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 outline-none focus:border-primary dark:text-white transition"
              >
                {angkatanOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-medium dark:text-white">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 outline-none focus:border-primary dark:text-white transition"
              >
                <option value="aktif">Aktif</option>
                <option value="lulus">Lulus</option>
                <option value="keluar">Keluar</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose}>
              Batal
            </Button>

            <Button type="submit">
              {initialData ? "Simpan Perubahan" : "Tambah Siswa"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
