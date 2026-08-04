import { useEffect, useState } from "react";
import {
  getReport,
  calculateSummary,
  exportReportExcel,
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

      const monthlyMap = {};

      data.forEach((item) => {
        let bulan = "-";

        if (item.lastPaymentAt?.toDate) {
          bulan = item.lastPaymentAt.toDate().toLocaleString("id-ID", {
            month: "short",
          });
        }

        if (!monthlyMap[bulan]) {
          monthlyMap[bulan] = {
            bulan,
            total: 0,
          };
        }

        monthlyMap[bulan].total += Number(item.totalDibayar || 0);
      });

      const jurusanMap = {};

      data.forEach((item) => {
        if (!jurusanMap[item.jurusan]) {
          jurusanMap[item.jurusan] = {
            jurusan: item.jurusan,
            dibayar: 0,
            sisa: 0,
          };
        }

        jurusanMap[item.jurusan].dibayar += Number(item.totalDibayar || 0);

        jurusanMap[item.jurusan].sisa += Number(item.totalSisa || 0);
      });

      /*
      ======================================
      Top Pembayar
      ======================================
      */

      const topStudents = [...data]
        .sort(
          (a, b) => Number(b.totalDibayar || 0) - Number(a.totalDibayar || 0),
        )
        .slice(0, 10);

      const now = new Date();

      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let monthlyTotal = 0;
      let monthlyCount = 0;

      let yearlyTotal = 0;
      let yearlyCount = 0;

      data.forEach((item) => {
        if (!item.lastPaymentAt?.toDate) return;

        const d = item.lastPaymentAt.toDate();

        if (d.getFullYear() === currentYear) {
          yearlyTotal += Number(item.totalDibayar || 0);
          yearlyCount++;
        }

        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          monthlyTotal += Number(item.totalDibayar || 0);
          monthlyCount++;
        }
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

        monthlyChart: Object.values(monthlyMap).sort((a, b) =>
          a.bulan.localeCompare(b.bulan),
        ),

        jurusanChart: Object.values(jurusanMap),

        outstandingJurusan: Object.values(jurusanMap),

        topStudents,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  function exportExcel(rows) {
    exportReportExcel(rows, filters);
  }

  return {
    reports,
    summary,
    loading,
    refresh: load,
    exportExcel,
  };
}
