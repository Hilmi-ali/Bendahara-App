const HEADER_MAP = {
  nis: ["nis"],

  nisn: ["nisn"],

  nama: ["nama", "nama siswa", "nama lengkap"],

  jurusan: ["jurusan", "kompetensi keahlian"],

  angkatan: ["angkatan", "tahun masuk", "tahun"],

  status: ["status"],
};

function normalizeKey(key) {
  return key.toString().trim().toLowerCase();
}

export function mapExcelData(rows) {
  return rows.map((row) => {
    const result = {};

    Object.keys(row).forEach((key) => {
      const normalized = normalizeKey(key);

      Object.entries(HEADER_MAP).forEach(([field, aliases]) => {
        if (aliases.includes(normalized)) {
          result[field] = row[key];
        }
      });
    });

    return {
      nis: String(result.nis || "").trim(),
      nisn: String(result.nisn || "").trim(),
      nama: String(result.nama || "").trim(),
      jurusan: String(result.jurusan || "").trim(),
      angkatan: Number(result.angkatan),
      status: result.status || "Aktif",
    };
  });
}
