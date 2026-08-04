import { HiBanknotes, HiEye } from "react-icons/hi2";

function rupiah(value = 0) {
  return "Rp " + Number(value).toLocaleString("id-ID");
}

function StatusBadge({ status }) {
  const isLunas = status === "Lunas";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        isLunas
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isLunas ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {status}
    </span>
  );
}

export default function PaymentTable({ students, onPay, onDetail }) {
  if (!students.length) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-darkcard p-12 text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Belum ada data pembayaran
        </h3>

        <p className="mt-1.5 text-sm text-gray-500 dark:text-zinc-400">
          Silakan buat paket tagihan terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-darkcard shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/80 dark:bg-zinc-900/60">
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Nama
              </th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                NIS
              </th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Jurusan
              </th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Total Tagihan
              </th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Dibayar
              </th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Sisa
              </th>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Potongan
              </th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Pembayaran
              </th>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-zinc-400">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
            {students.map((siswa) => (
              <tr
                key={siswa.nis}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {siswa.nama}
                </td>

                <td className="px-4 py-3 text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                  {siswa.nis}
                </td>

                <td className="px-4 py-3 text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                  {siswa.jurusan}
                </td>

                <td className="px-4 py-3 text-right tabular-nums text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                  {rupiah(siswa.totalTagihan)}
                </td>

                <td className="px-4 py-3 text-right tabular-nums font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  {rupiah(siswa.totalDibayar)}
                </td>

                <td className="px-4 py-3 text-right tabular-nums font-medium text-rose-600 dark:text-rose-400 whitespace-nowrap">
                  {rupiah(siswa.totalSisa)}
                </td>

                <td className="px-4 py-3 text-right tabular-nums font-medium text-amber-600 dark:text-amber-400 whitespace-nowrap">
                  {rupiah(siswa.totalPotongan)}
                </td>

                <td className="px-4 py-3 text-right tabular-nums text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                  {siswa.lastPayment > 0 ? rupiah(siswa.lastPayment) : "-"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1.5">
                    <button
                      onClick={() => onPay(siswa)}
                      title="Bayar"
                      className="rounded-lg bg-primary p-2 text-white transition hover:opacity-90 active:scale-95"
                    >
                      <HiBanknotes size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
