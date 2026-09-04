import { useEffect, useState } from "react";

import {
  getReport,
  calculateSummary,
  getFinancialReport,
  exportFinancialReportExcel,
} from "../services/reportService";

export default function useReports(filters = {}) {
  const [reports, setReports] = useState([]);

  const [summary, setSummary] = useState({
    totalTagihan: 0,
    totalDibayar: 0,
    totalPotongan: 0,
    totalSisa: 0,
    jumlahTransaksi: 0,

    monthlySummary: {
      total: 0,
      count: 0,
    },

    yearlySummary: {
      total: 0,
      count: 0,
    },

    monthlyChart: [],
    jurusanChart: [],
    topStudents: [],
    outstandingJurusan: [],
  });

  const [loading, setLoading] = useState(true);

  const [financialReport, setFinancialReport] = useState([]);

  const [financialLoading, setFinancialLoading] = useState(false);

  /*
   * =========================================================
   * LOAD LAPORAN SISWA
   * =========================================================
   */

  useEffect(() => {
    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  async function load() {
    setLoading(true);

    try {
      const data = await getReport(filters);

      setReports(data);

      const baseSummary = calculateSummary(data);

      const now = new Date();

      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let monthlyTotal = 0;
      let monthlyCount = 0;

      let yearlyTotal = 0;
      let yearlyCount = 0;

      /*
       * =====================================================
       * SUMMARY BULANAN
       * =====================================================
       */

      const monthlyTransactions = data.filter((item) => {
        if (!item.lastPaymentAt?.toDate) {
          return false;
        }

        const d = item.lastPaymentAt.toDate();

        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      });

      /*
       * =====================================================
       * SUMMARY TAHUNAN
       * =====================================================
       */

      const yearlyTransactions = data.filter((item) => {
        if (!item.lastPaymentAt?.toDate) {
          return false;
        }

        const d = item.lastPaymentAt.toDate();

        return d.getFullYear() === currentYear;
      });

      monthlyTransactions.forEach((item) => {
        monthlyTotal += Number(item.periodDibayar || item.totalDibayar || 0);

        monthlyCount += Number(
          item.periodTransactionCount || item.transactionCount || 1,
        );
      });

      yearlyTransactions.forEach((item) => {
        yearlyTotal += Number(item.periodDibayar || item.totalDibayar || 0);

        yearlyCount += Number(
          item.periodTransactionCount || item.transactionCount || 1,
        );
      });

      setSummary({
        ...baseSummary,

        monthlySummary: {
          total: monthlyTotal,
          count: monthlyCount,
        },

        yearlySummary: {
          total: yearlyTotal,
          count: yearlyCount,
        },

        /*
         * Chart tidak lagi dipakai oleh Reports.jsx.
         *
         * Property tetap dipertahankan supaya tidak
         * merusak komponen lain yang mungkin membacanya.
         */
        monthlyChart: [],

        jurusanChart: baseSummary.jurusanChart || [],

        outstandingJurusan: baseSummary.outstandingJurusan || [],

        topStudents: baseSummary.topStudents || [],
      });
    } catch (err) {
      console.error("Gagal memuat laporan:", err);
    } finally {
      setLoading(false);
    }
  }

  /*
   * =========================================================
   * LOAD LAPORAN KEUANGAN
   * =========================================================
   */

  async function loadFinancialReport({
    period = "monthly",

    month = new Date().getMonth() + 1,

    year = new Date().getFullYear(),

    jurusan = "",
  } = {}) {
    setFinancialLoading(true);

    try {
      const data = await getFinancialReport({
        period,
        month,
        year,
        jurusan,
      });

      setFinancialReport(data);

      return data;
    } catch (error) {
      console.error("Gagal memuat laporan keuangan:", error);

      throw error;
    } finally {
      setFinancialLoading(false);
    }
  }

  /*
   * =========================================================
   * EXPORT EXCEL
   * =========================================================
   */

  async function exportExcel({
    period = "monthly",

    month = new Date().getMonth() + 1,

    year = new Date().getFullYear(),

    jurusan = "",

    data = [],
  } = {}) {
    return exportFinancialReportExcel({
      data,
      period,
      month,
      year,
      jurusan,
    });
  }

  return {
    reports,
    summary,
    loading,

    financialReport,
    financialLoading,

    refresh: load,

    loadFinancialReport,

    exportExcel,
  };
}
