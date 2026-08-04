import { useEffect, useState } from "react";

import { getStudents, getTransactions } from "../services/paymentService";

export default function usePayments() {
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  async function refresh(filters = {}) {
    setLoading(true);

    const [studentData, transactionData] = await Promise.all([
      getStudents(filters),
      getTransactions(),
    ]);

    setStudents(studentData);
    setTransactions(transactionData);

    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    students,
    transactions,
    loading,
    refresh,
  };
}
