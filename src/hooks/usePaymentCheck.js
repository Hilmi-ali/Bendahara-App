import { useEffect, useMemo, useState } from "react";
import { getPaidBillsByKeyword } from "../services/paymentCheckService";

export default function usePaymentCheck(keyword) {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getPaidBillsByKeyword(keyword)
      .then((data) => active && setRawData(data))
      .catch((err) => console.error("Gagal memuat data pembayaran:", err))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [keyword]);

  // Daftar nama tagihan unik, misal "ASTS 1", "ASTS 2 Kelas 11"
  const subItems = useMemo(
    () => [...new Set(rawData.map((d) => d.namaTagihan))].sort(),
    [rawData],
  );

  return { rawData, subItems, loading };
}
