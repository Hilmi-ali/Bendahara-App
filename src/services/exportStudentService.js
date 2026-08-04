import ExcelJS from "exceljs";

import { saveAs } from "file-saver";

export async function exportStudents(students) {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Data Siswa");

  sheet.columns = [
    { header: "NIS", key: "nis", width: 18 },

    { header: "NISN", key: "nisn", width: 22 },

    { header: "Nama", key: "nama", width: 35 },

    { header: "Jurusan", key: "jurusan", width: 18 },

    { header: "Angkatan", key: "angkatan", width: 15 },

    { header: "Status", key: "status", width: 15 },
  ];

  students.forEach((student) => {
    sheet.addRow(student);
  });

  sheet.getRow(1).font = {
    bold: true,

    color: { argb: "FFFFFFFF" },
  };

  sheet.getRow(1).fill = {
    type: "pattern",

    pattern: "solid",

    fgColor: { argb: "2563EB" },
  };

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),

    "Data_Siswa.xlsx",
  );
}
