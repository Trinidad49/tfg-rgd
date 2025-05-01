import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { toPng } from "html-to-image";
import { ChartRenderer } from "./ChartRenderer";
import { ChartControls } from "./ChartControls";

export const GenerateChart = ({ text, data, optional }) => {
  const [chartType, setChartType] = useState("barh");
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

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box width="100%" maxWidth={800} height={600} ref={chartRef}>
        <ChartRenderer type={chartType} data={data} optional={optional} title={title} />
      </Box>
      <ChartControls
        chartType={chartType}
        onTypeChange={(e) => setChartType(e.target.value)}
        title={title}
        onTitleChange={(e) => setTitle(e.target.value)}
        onDownload={handleDownload}
      />
    </Box>
  );
};