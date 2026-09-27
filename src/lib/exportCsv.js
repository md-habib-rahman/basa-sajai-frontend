
export const downloadCsv = (rows, headers, filename = "report.csv") => {
  if (!rows || !rows.length) return;

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const val =
            row[header] !== undefined && row[header] !== null
              ? row[header]
              : "";
          // Escape quotes and wrap values containing commas/newlines in quotes
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
