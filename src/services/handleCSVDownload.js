export function handleCSVDownload(chartData, question) {
    const BOM = "\uFEFF";
    const rows = [];

    rows.push(["Answer", "Count"]);
    chartData.forEach((item) => {
        rows.push([item.text, item.count]);
    });

    const escapeCSV = (value) => {
        if (value == null) return "";
        const str = value.toString();
        return `"${str.replace(/"/g, '""')}"`;
    };

    const delimiter = ";";
    const csvContent = BOM + rows.map(row => row.map(escapeCSV).join(delimiter)).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const safeTitle = question.text.replace(/[<>:"/\\|?*]+/g, "_");
    link.setAttribute("download", `${safeTitle}_data.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
