import { useMemo, useState } from "react";
import { HiClock } from "react-icons/hi2";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import PaymentTable from "../components/payments/PaymentTable";
import PaymentModal from "../components/payments/PaymentModal";
import TransactionHistoryModal from "../components/payments/TransactionHistoryModal";

import usePayments from "../hooks/usePayments";
import { cancelTransaction } from "../services/paymentService";

export default function Payments() {
  const { students, transactions, loading, refresh } = usePayments();

  const [search, setSearch] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [angkatan, setAngkatan] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [paymentOpen, setPaymentOpen] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const cocokNama =
        s.nama?.toLowerCase().includes(search.toLowerCase()) ||
        s.nis?.includes(search);

      const cocokJurusan = jurusan ? s.jurusan === jurusan : true;

      const cocokAngkatan = angkatan
        ? Number(s.angkatan) === Number(angkatan)
        : true;

      return cocokNama && cocokJurusan && cocokAngkatan;
    });
  }, [students, search, jurusan, angkatan]);

  const angkatanOptions = useMemo(() => {
    return [...new Set(students.map((s) => s.angkatan))]
      .filter(Boolean)
      .sort((a, b) => b - a);
  }, [students]);

  function handleBayar(student) {
    setSelectedStudent(student);
    setPaymentOpen(true);
  }

  async function handleUndo(trx) {
    // kembalikan nominal ke tagihan semula
    const result = await cancelTransaction(trx.id);

    await refresh();

    setHistoryOpen(false);

    const studentToReopen = students.find((s) => s.nis === result.nis) || {
      nis: result.nis,
      nama: result.nama,
    };

    setSelectedStudent(studentToReopen);
    setPaymentOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}

      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}

        <div className=" sm:w-90 lg:w-64">
          <Input
            size="sm"
            placeholder="Cari NIS / Nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!h-9 !rounded-lg !bg-zinc-50 !pl-4 !pr-10 !text-xs !text-zinc-900 dark:!bg-zinc-950 dark:!text-zinc-50"
          />
        </div>

        {/* Jurusan */}

        <select
          value={jurusan}
          onChange={(e) => setJurusan(e.target.value)}
          className="!h-9 !rounded-lg !bg-zinc-50 !pl-3 !pr-10 !text-xs !text-zinc-900 dark:!bg-zinc-950 dark:!text-zinc-50 border
      border-zinc-200
      dark:border-zinc-700"
        >
          <option value="">Semua Jurusan</option>
          <option value="TJKT">TJKT</option>
          <option value="AKL">AKL</option>
        </select>

        {/* Angkatan */}

        <select
          value={angkatan}
          onChange={(e) => setAngkatan(e.target.value)}
          className="!h-9 !rounded-lg !bg-zinc-50 !pl-3 !pr-10 !text-xs !text-zinc-900 dark:!bg-zinc-950 dark:!text-zinc-50 border
      border-zinc-200
      dark:border-zinc-700"
        >
          <option value="">Semua Angkatan</option>

          {angkatanOptions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        {/* Spacer */}

        <div className="flex-1" />

        {/* History */}

        <Button
          variant="secondary"
          icon={HiClock}
          onClick={() => setHistoryOpen(true)}
          className="!h-9 !rounded-xl !border-teal-200 !px-3 !text-xs !font-semibold !text-teal-700 hover:!border-teal-300 hover:!bg-teal-50 dark:!border-teal-900 dark:!text-teal-300 dark:hover:!bg-teal-950/40"
        >
          Riwayat
        </Button>
      </div>

      {/* Table */}

      <PaymentTable
        loading={loading}
        students={filteredStudents}
        onPay={handleBayar}
      />

      {/* Modal Bayar */}

      <PaymentModal
        open={paymentOpen}
        student={selectedStudent}
        onClose={() => {
          setPaymentOpen(false);
          refresh();
        }}
      />

      {/* History */}

      <TransactionHistoryModal
        open={historyOpen}
        transactions={transactions}
        onClose={() => setHistoryOpen(false)}
        onUndo={handleUndo}
      />
    </div>
  );
}
