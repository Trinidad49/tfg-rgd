import React, { useState, useRef } from "react";
import { Box } from "@mui/material";
import { toPng } from "html-to-image";
import { MultiRenderer } from "./MultiRenderer";
import { MultiControls } from "./MultiControls";
import { TableData } from "./TableData";

export const MultiChart = ({ dataA, dataB, chartType, surveyATitle, surveyBTitle }) => {
  const chartRef = useRef(null);
  const [title, setTitle] = useState("Multi-Survey Chart");

  const mergedData = [];

  const allLabels = new Set([...dataA.map(d => d.text), ...dataB.map(d => d.text)]);

  allLabels.forEach(label => {
    const aItem = dataA.find(d => d.text === label);
    const bItem = dataB.find(d => d.text === label);

    mergedData.push({
      text: label,
      A: aItem ? aItem.count : 0,
      B: bItem ? bItem.count : 0,
    });
  });

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
    const BOM = "\uFEFF";
    const rows = [["Category", surveyATitle, surveyBTitle]];

    mergedData.forEach(row => {
      rows.push([row.text, row.A, row.B]);
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
    link.setAttribute("download", `${title || "multi-chart-data"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box
        display="flex"
        flexDirection="column"
        width="70%"
        paddingX={4}
        paddingY={4}
        gap={4}
        alignItems="center" // center child items horizontally inside this column
      >
        <Box height={600} ref={chartRef} width="100%">
          <MultiRenderer
            type="groupedBar"
            data={mergedData}
            title={title}
            surveyATitle={surveyATitle}
            surveyBTitle={surveyBTitle}
          />
        </Box>

        <Box width="100%">
          <MultiControls
            chartType="groupedBar"
            title={title}
            onTitleChange={(e) => setTitle(e.target.value)}
            onDownload={handleDownload}
            downloadChart={handleCSVDownload}
          />
        </Box>

        <Box display="flex" justifyContent="center" width="100%">
          <TableData
            data={mergedData}
            surveyATitle={surveyATitle}
            surveyBTitle={surveyBTitle}
          />
        </Box>
      </Box>
    </Box>

  );
};
