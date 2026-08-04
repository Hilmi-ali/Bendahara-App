import * as XLSX from "xlsx";

export default function ImportExcelButton({ onLoad }) {
  function handleFile(e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, {
        type: "binary",
      });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
      });

      onLoad(json);
    };

    reader.readAsBinaryString(file);
  }

  return (
    <label className="cursor-pointer">
      <input hidden type="file" accept=".xlsx,.xls" onChange={handleFile} />
      Import Excel
    </label>
  );
}
