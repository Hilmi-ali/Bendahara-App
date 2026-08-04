import { HiXMark, HiArrowUpTray, HiDocumentCheck } from "react-icons/hi2";
import Button from "../ui/Button";

export default function ImportStudentModal({ open, onClose, onSelectFile }) {
  if (!open) return null;

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (onSelectFile) {
      onSelectFile(file);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 font-sans">
      <div className="w-full max-w-lg rounded-[32px] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl shadow-black/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Import Data Siswa
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Unggah data siswa secara massal
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition"
          >
            <HiXMark size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <label className="group block cursor-pointer">
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />

            <div
              className="
                rounded-[28px]
                border-2 border-dashed
                border-zinc-200 dark:border-white/10
                bg-zinc-50/60 dark:bg-white/[0.03]
                group-hover:border-indigo-400 dark:group-hover:border-indigo-500/60
                group-hover:bg-indigo-50/60 dark:group-hover:bg-indigo-500/[0.06]
                transition-all duration-300
                p-10 text-center
              "
            >
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <HiArrowUpTray size={26} className="text-white" />
              </div>

              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
                Pilih File Excel
              </h3>

              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                atau seret & lepas file ke sini
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-3 py-1.5">
                <HiDocumentCheck size={14} className="text-indigo-500" />
                <b className="text-zinc-700 dark:text-zinc-200">
                  .xlsx
                </b> &amp;{" "}
                <b className="text-zinc-700 dark:text-zinc-200">.xls</b>
              </div>

              <span
                className="
                  mt-6 ms-5 inline-flex items-center gap-2
                  rounded-full
                  bg-gradient-to-r from-indigo-600 to-violet-600
                  px-6 py-3
                  text-white font-medium text-sm
                  shadow-lg shadow-indigo-500/25
                  group-hover:shadow-xl group-hover:shadow-indigo-500/30
                  group-hover:-translate-y-0.5
                  transition-all duration-300
                "
              >
                <HiArrowUpTray size={16} />
                Pilih File
              </span>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-white/5 p-6 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
        </div>
      </div>
    </div>
  );
}
