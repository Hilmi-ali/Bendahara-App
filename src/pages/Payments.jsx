import { useMemo, useState } from "react";
import { HiClock } from "react-icons/hi2";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import PaymentTable from "../components/payments/PaymentTable";
import PaymentModal from "../components/payments/PaymentModal";
import TransactionHistoryModal from "../components/payments/TransactionHistoryModal";

import usePayments from "../hooks/usePayments";

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

  return (
    <div className="space-y-6">
      {/* Toolbar */}

      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}

        <div className=" sm:w-90 lg:w-64">
          <Input
            placeholder="Cari NIS / Nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Jurusan */}

        <select
          value={jurusan}
          onChange={(e) => setJurusan(e.target.value)}
          className="
      h-10
      w-36
      rounded-xl
      border
      border-zinc-200
      dark:border-zinc-700
      bg-white
      dark:bg-darkcard
      px-3
      text-sm
      dark:text-white
      focus:ring-2
      focus:ring-primary/20
    "
        >
          <option value="">Semua Jurusan</option>
          <option value="TJKT">TJKT</option>
          <option value="AKL">AKL</option>
        </select>

        {/* Angkatan */}

        <select
          value={angkatan}
          onChange={(e) => setAngkatan(e.target.value)}
          className="
      h-10
      w-36
      rounded-xl
      border
      border-zinc-200
      dark:border-zinc-700
      bg-white
      dark:bg-darkcard
      px-3
      text-sm
      dark:text-white
      focus:ring-2
      focus:ring-primary/20
    "
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
          className="h-10 px-4 text-sm"
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
      />
    </div>
  );
}
