import { useMemo, useState } from "react";
import { HiPlus } from "react-icons/hi2";

import Button from "../components/ui/Button";
import BillModal from "../components/bills/BillModal";
import BillTable from "../components/bills/BillTable";

import useBills from "../hooks/useBills";
import { createBillPackage } from "../services/billService";

export default function Bills() {
  const { bills, loading, refresh } = useBills();

  const [modalOpen, setModalOpen] = useState(false);

  const packages = useMemo(() => {
    const map = {};

    bills.forEach((bill) => {
      if (!map[bill.paketId]) {
        map[bill.paketId] = {
          paketId: bill.paketId,

          jurusan: bill.jurusan,

          angkatan: bill.angkatan,

          items: [],

          total: 0,
        };
      }

      map[bill.paketId].items.push(bill);

      map[bill.paketId].total += bill.nominal;
    });

    return Object.values(map);
  }, [bills]);

  async function handleSubmit(data) {
    try {
      await createBillPackage(data);

      await refresh();

      setModalOpen(false);

      alert("Paket tagihan berhasil dibuat.");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="text-2xl font-bold dark:text-white">Kelola Tagihan</h4>
        </div>

        <Button icon={HiPlus} onClick={() => setModalOpen(true)}>
          Tambah Tagihan
        </Button>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white dark:bg-darkcard p-10 text-center">
          Memuat data...
        </div>
      ) : (
        <BillTable
          packages={packages}
          onDetail={(pkg) => console.log(pkg)}
          onEdit={(pkg) => console.log(pkg)}
          onDelete={(pkg) => console.log(pkg)}
        />
      )}

      <BillModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
