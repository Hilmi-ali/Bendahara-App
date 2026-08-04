import { useEffect, useState } from "react";
import { HiPlus, HiTrash, HiOutlineDocumentText } from "react-icons/hi2";

import Button from "../ui/Button";
import Input from "../ui/Input";

import { previewBillPackage } from "../../services/billService";

const kosong = {
  nama: "",
  nominal: "",
};

export default function BillModal({ open, onClose, onSubmit }) {
  const [jurusan, setJurusan] = useState("TJKT");

  const [angkatan, setAngkatan] = useState(new Date().getFullYear());

  const [items, setItems] = useState([{ ...kosong }]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPreview() {
      const valid = items.filter((i) => i.nama && Number(i.nominal) > 0);

      if (!valid.length) {
        setPreview(null);
        return;
      }

      try {
        const result = await previewBillPackage({
          jurusan,
          angkatan: Number(angkatan),
          items: valid,
        });

        setPreview(result);
      } catch {
        setPreview(null);
      }
    }

    loadPreview();
  }, [jurusan, angkatan, items]);

  if (!open) return null;

  function tambahBaris() {
    setItems((prev) => [...prev, { ...kosong }]);
  }

  function hapusBaris(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleChange(index, field, value) {
    const clone = [...items];

    clone[index][field] = value;

    setItems(clone);
  }

  async function submit(e) {
    e.preventDefault();

    const valid = items.filter((i) => i.nama && Number(i.nominal) > 0);

    if (!valid.length) {
      alert("Minimal satu tagihan.");
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        jurusan,
        angkatan: Number(angkatan),
        items: valid,
      });

      setItems([{ ...kosong }]);

      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex justify-center items-center p-5 font-sans">
      <form
        onSubmit={submit}
        className="w-full max-w-5xl rounded-[32px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl shadow-black/20 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-zinc-100 dark:border-white/5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <HiOutlineDocumentText size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Paket Tagihan
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Buat paket tagihan untuk jurusan & angkatan tertentu
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8 overflow-y-auto modern-scroll">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Jurusan
              </label>

              <select
                value={jurusan}
                onChange={(e) => setJurusan(e.target.value)}
                className="
                  w-full mt-2 h-12 rounded-2xl
                  border border-zinc-200 dark:border-white/10
                  bg-zinc-50 dark:bg-white/[0.04]
                  text-zinc-900 dark:text-white
                  px-4
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
                  transition
                "
              >
                <option>TJKT</option>
                <option>AKL</option>
              </select>
            </div>

            <Input
              label="Angkatan"
              type="number"
              value={angkatan}
              onChange={(e) => setAngkatan(e.target.value)}
              className="rounded-2xl"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
                  Daftar Tagihan
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {items.length} item ditambahkan
                </p>
              </div>

              <Button
                type="button"
                onClick={tambahBaris}
                className="!rounded-full !px-5 !py-2.5 inline-flex items-center gap-2"
              >
                <HiPlus size={16} />
                Tambah Baris
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="
                    grid grid-cols-12 gap-3 items-center
                    rounded-2xl
                    bg-zinc-50 dark:bg-white/[0.03]
                    border border-zinc-100 dark:border-white/5
                    p-3
                  "
                >
                  <div className="col-span-7">
                    <Input
                      placeholder="Nama Tagihan"
                      value={item.nama}
                      onChange={(e) =>
                        handleChange(index, "nama", e.target.value)
                      }
                      className="rounded-xl bg-white dark:bg-white/[0.04]"
                    />
                  </div>

                  <div className="col-span-4">
                    <Input
                      type="number"
                      placeholder="Nominal"
                      value={item.nominal}
                      onChange={(e) =>
                        handleChange(index, "nominal", e.target.value)
                      }
                      className="rounded-xl bg-white dark:bg-white/[0.04]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => hapusBaris(index)}
                    className="
                      col-span-1 h-11
                      rounded-xl
                      border border-rose-200 dark:border-rose-500/20
                      text-rose-500 dark:text-rose-400
                      hover:bg-rose-50 dark:hover:bg-rose-500/10
                      transition
                      flex items-center justify-center
                    "
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-100 dark:border-white/5 px-8 py-5 flex justify-end gap-3 bg-white/60 dark:bg-transparent">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            className="!rounded-full !px-6"
          >
            Batal
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="!rounded-full !px-6 bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
