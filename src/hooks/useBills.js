import { useEffect, useState } from "react";

import { getBills } from "../services/billService";

export default function useBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadBills() {
    setLoading(true);

    const data = await getBills();

    setBills(data);

    setLoading(false);
  }

  useEffect(() => {
    loadBills();
  }, []);

  return {
    bills,
    loading,
    refresh: loadBills,
  };
}
