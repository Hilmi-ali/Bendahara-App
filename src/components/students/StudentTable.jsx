import { HiPencilSquare, HiTrash } from "react-icons/hi2";

import Card from "../ui/Card";

function StatusBadge({ status }) {
  const isActive = status === "Aktif";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        isActive
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-500/10 dark:text-zinc-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-zinc-400"
        }`}
      />
      {status}
    </span>
  );
}

function JurusanTag({ jurusan }) {
  return (
    <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-zinc-800 px-2 py-1 text-[11px] font-medium tracking-wide text-gray-600 dark:text-zinc-300">
      {jurusan}
    </span>
  );
}

export default function StudentTable({ students, onEdit, onDelete }) {
  if (!students.length) {
    return (
      <Card className="p-12 text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Tidak ada data siswa
        </h3>

        <p className="mt-1.5 text-sm text-gray-500 dark:text-zinc-400">
          Coba ubah pencarian atau filter yang digunakan.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/80 dark:bg-zinc-900/60">
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                NIS
              </th>

              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Nama
              </th>

              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Jurusan
              </th>

              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Angkatan
              </th>

              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Status
              </th>

              <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
            {students.map((student) => (
              <tr
                key={student.nis}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50"
              >
                <td className="px-4 py-3 tabular-nums text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                  {student.nis}
                </td>

                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {student.nama}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <JurusanTag jurusan={student.jurusan} />
                </td>

                <td className="px-4 py-3 tabular-nums text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                  {student.angkatan}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={student.status} />
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1.5">
                    <button
                      onClick={() => onEdit(student)}
                      title="Edit"
                      className="rounded-lg border border-gray-200 dark:border-zinc-700 p-2 text-gray-600 dark:text-zinc-300 transition hover:bg-gray-100 dark:hover:bg-zinc-700 active:scale-95"
                    >
                      <HiPencilSquare size={15} />
                    </button>

                    <button
                      onClick={() => onDelete(student)}
                      title="Hapus"
                      className="rounded-lg border border-gray-200 dark:border-zinc-700 p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10 active:scale-95"
                    >
                      <HiTrash size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
