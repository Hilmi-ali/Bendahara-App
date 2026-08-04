import { HiEye, HiPencilSquare, HiTrash } from "react-icons/hi2";

export default function BillTable({ packages, onDetail, onEdit, onDelete }) {
  if (!packages.length) {
    return (
      <div className="rounded-3xl bg-white dark:bg-darkcard p-10 text-center border border-gray-200 dark:border-zinc-700">
        <h3 className="text-xl font-semibold dark:text-white">
          Belum ada paket tagihan
        </h3>

        <p className="text-gray-500 mt-2">
          Silakan buat paket tagihan terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
      {packages.map((pkg) => (
        <div
          key={pkg.paketId}
          className="rounded-3xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-darkcard p-6 shadow-sm hover:shadow-lg transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold dark:text-white">
                {pkg.jurusan}
              </h3>

              <p className="text-gray-500">Angkatan {pkg.angkatan}</p>
            </div>

            <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">
              {pkg.items.length} Tagihan
            </span>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">Total Nominal</p>

            <h2 className="text-3xl font-bold dark:text-white mt-1">
              Rp {pkg.total.toLocaleString("id-ID")}
            </h2>
          </div>

          <div className="mt-8 flex gap-2">
            <button
              onClick={() => onDetail(pkg)}
              className="flex-1 rounded-xl bg-primary text-white py-2 flex justify-center items-center gap-2"
            >
              <HiEye />
              Detail
            </button>

            <button
              onClick={() => onEdit(pkg)}
              className="rounded-xl border px-3"
            >
              <HiPencilSquare />
            </button>

            <button
              onClick={() => onDelete(pkg)}
              className="rounded-xl border border-red-200 text-red-500 px-3"
            >
              <HiTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
