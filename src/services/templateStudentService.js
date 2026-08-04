import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function downloadStudentTemplate() {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Template");

  sheet.columns = [
    { header: "NIS", key: "nis", width: 20 },

    { header: "NISN", key: "nisn", width: 25 },

    { header: "Nama", key: "nama", width: 35 },

    { header: "Jurusan", key: "jurusan", width: 18 },

    { header: "Angkatan", key: "angkatan", width: 15 },

    { header: "Status", key: "status", width: 15 },
  ];

  sheet.getRow(1).font = {
    bold: true,

    color: { argb: "FFFFFFFF" },
  };

  sheet.getRow(1).fill = {
    type: "pattern",

    pattern: "solid",

    fgColor: { argb: "2563EB" },
  };

  sheet.views = [
    {
      state: "frozen",

      ySplit: 1,
    },
  ];

  sheet.addRow({
    nis: "260001",

    nisn: "009998877",

    nama: "Andi Saputra",

    jurusan: "TJKT",

    angkatan: 2026,

    status: "Aktif",
  });

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),

    "Template_Data_Siswa.xlsx",
  );
}
