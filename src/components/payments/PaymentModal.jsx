import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";

import { getStudentBills, savePayment } from "../../services/paymentService";

function StatusBadge({ status }) {
  const isLunas = status === "Lunas";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold font-mono ${
        isLunas
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isLunas ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      {status}
    </span>
  );
}

export default function PaymentModal({ open, student, onClose }) {
  const [loading, setLoading] = useState(false);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    if (!open || !student) return;

    async function load() {
      const data = await getStudentBills(student.nis);

      setBills(
        data.map((b) => ({
          ...b,
          bayar: "",
          potongan: "",
        })),
      );
    }

    load();
  }, [open, student]);

  function handleChange(index, field, value) {
    const clone = [...bills];

    clone[index][field] = value;

    setBills(clone);
  }

  async function submit() {
    const payments = bills.filter(
      (b) => Number(b.bayar) > 0 || Number(b.potongan) > 0,
    );

    if (!payments.length) {
      alert("Belum ada pembayaran.");
      return;
    }

    setLoading(true);

    try {
      await savePayment({
        nis: student.nis,
        nama: student.nama,
        operator: "Bendahara",
        payments,
      });

      alert("Pembayaran berhasil.");

      onClose();
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  }

  if (!open || !student) return null;

  const totalSisa = bills.reduce((sum, b) => sum + (b.sisa || 0), 0);
  const totalInput = bills.reduce(
    (sum, b) => sum + (Number(b.bayar) || 0) + (Number(b.potongan) || 0),
    0,
  );

  return (
    <div className="fixed inset-0 bg-zinc-950/60  z-50 flex justify-center items-center p-4">
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-[#131316] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] border border-zinc-200/70 dark:border-white/[0.06] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-20 relative border-b border-zinc-100 dark:border-white/10 bg-white/80 dark:bg-[#131316]/80 backdrop-blur-xl px-7 py-5 shrink-0">
          <div
            className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-violet-400/10 to-emerald-400/10 blur-3xl"
            aria-hidden="true"
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-500 dark:text-violet-400 mb-1">
            Pembayaran
          </p>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
            {student.nama}
          </h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5 font-mono">
            NIS {student.nis}
          </p>
        </div>

        {/* Bill list */}
        <div
          className="
        modern-scroll
        overflow-y-auto
        px-7
        py-6
        space-y-4
        bg-zinc-50/40
        dark:bg-black/20
    "
        >
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Total Tagihan</p>

              <h3 className="mt-1 text-lg font-bold dark:text-white">
                Rp {totalSisa.toLocaleString("id-ID")}
              </h3>
            </div>

            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Input Pembayaran</p>

              <h3 className="mt-1 text-lg font-bold text-green-600">
                Rp {totalInput.toLocaleString("id-ID")}
              </h3>
            </div>

            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Jumlah Tagihan</p>

              <h3 className="mt-1 text-lg font-bold dark:text-white">
                {bills.length}
              </h3>
            </div>
          </div>
          {bills.map((bill, index) => (
            <div
              key={bill.id}
              className="group rounded-3xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-[#18181B]/80 backdrop-blur-xl
p-5
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {bill.nama}
                  </h3>

                  <div className="mt-1.5 flex flex-col gap-1 text-xs">
                    <span className="text-zinc-400 dark:text-zinc-500">
                      Nominal{" "}
                      <span className="ml-1 font-mono tabular-nums text-zinc-600 dark:text-zinc-300">
                        Rp {bill.nominal.toLocaleString("id-ID")}
                      </span>
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-500">
                      Sisa{" "}
                      <span className="ml-1 font-mono tabular-nums font-semibold text-zinc-900 dark:text-white">
                        Rp {bill.sisa.toLocaleString("id-ID")}
                      </span>
                    </span>
                  </div>
                </div>

                <StatusBadge status={bill.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="col-span-2 mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Sisa Pembayaran</span>

                    <span>
                      {Math.round(
                        ((bill.nominal - bill.sisa) / bill.nominal) * 100 || 0,
                      )}
                      %
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
                      style={{
                        width: `${Math.round(
                          ((bill.nominal - bill.sisa) / bill.nominal) * 100 ||
                            0,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <Input
                  label="Bayar"
                  type="number"
                  value={bill.bayar}
                  onChange={(e) => handleChange(index, "bayar", e.target.value)}
                />

                <Input
                  label="Potongan"
                  type="number"
                  value={bill.potongan}
                  onChange={(e) =>
                    handleChange(index, "potongan", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          {bills.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                Memuat tagihan...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="
sticky
bottom-0
border-t
border-zinc-100
dark:border-white/10
bg-white/90
dark:bg-[#131316]/90
backdrop-blur-xl
px-7
py-5
flex
justify-between
items-center
"
        >
          <div className="hidden sm:flex flex-col font-mono">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500">
              Total dimasukkan
            </span>
            <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-white">
              Rp {totalInput.toLocaleString("id-ID")}
              <span className="text-zinc-400 dark:text-zinc-500 font-normal">
                {" "}
                / {totalSisa.toLocaleString("id-ID")}
              </span>
            </span>
          </div>

          <div className="flex justify-end gap-2 ml-auto">
            <Button variant="secondary" onClick={onClose}>
              Batal
            </Button>

            <Button disabled={loading} onClick={submit}>
              {loading ? "Menyimpan..." : "Simpan Pembayaran"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
