import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { toPng } from "html-to-image";
import { ChartRenderer } from "./ChartRenderer";
import { ChartControls } from "./ChartControls";

export const GenerateChart = ({ text, data, optional, chartType, setChartType }) => {
  const [title, setTitle] = useState(text);
  const chartRef = useRef(null);

  useEffect(() => {
    setTitle(text);
  }, [text]);

  const handleDownload = () => {
    if (chartRef.current) {
      toPng(chartRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${title}.png`;
          link.click();
        })
        .catch((error) => {
          console.error("Error generating chart image:", error);
        });
    }
  };

  const handleCSVDownload = () => {
    const BOM = "\uFEFF"; // UTF-8 BOM
    const rows = [];

    if (optional && (chartType === "stackedBar" || chartType === "groupedBar")) {
      const keys = Object.keys(optional[0].options);
      rows.push(["Category", ...keys]);

      optional.forEach((item) => {
        const row = [item.text];
        keys.forEach((key) => {
          row.push(item.options[key]);
        });
        rows.push(row);
      });
    } else {
      rows.push(["Answer", "Count"]);
      data.forEach((item) => {
        rows.push([item.text, item.count]);
      });
    }

    // Proper escaping
    const escapeCSV = (value) => {
      if (value == null) return "";
      const str = value.toString();
      return `"${str.replace(/"/g, '""')}"`;
    };

    const delimiter = ";"; // Use semicolon for Excel compatibility
    const csvContent = BOM + rows.map(row => row.map(escapeCSV).join(delimiter)).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${title || "chart-data"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box width="100%" maxWidth={800} height={600} ref={chartRef}>
        <ChartRenderer
          type={chartType}
          data={data}
          optional={optional}
          title={title}
        />
      </Box>
      <ChartControls
        chartType={chartType}
        onTypeChange={(e) => setChartType(e.target.value)}
        title={title}
        onTitleChange={(e) => setTitle(e.target.value)}
        onDownload={handleDownload}
        downloadChart={handleCSVDownload}
      />
    </Box>
  );
};
