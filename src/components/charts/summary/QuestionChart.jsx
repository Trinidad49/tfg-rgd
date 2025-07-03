import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { toPng } from "html-to-image";

export const QuestionChart = ({ question, responses, chartData }) => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState("bar");

  // Determine default chart type based on question.type
  useEffect(() => {
    if (question.type === "multipleChoice") setChartType("pie");
    else setChartType("bar"); // checkbox and linear default to bar
  }, [question.type]);

  // chartData format: [{ text, count, color }]
  // Normalize for bar chart: keys: answer (label), count
  const normalizedBarData = chartData.map(({ text, count, color }) => ({
    answer: text,
    count,
    color,
  }));

  const handleChartTypeChange = (_, newType) => {
    if (newType !== null) setChartType(newType);
  };

  const handleDownload = () => {
    if (!chartRef.current) return;

    toPng(chartRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        const safeTitle = question.text.replace(/[<>:"/\\|?*]+/g, "_");
        link.href = dataUrl;
        link.download = `${safeTitle}.png`;
        link.click();
      })
      .catch((error) => {
        console.error("Error generating chart image:", error);
      });
  };

  // Render pie or bar charts for multipleChoice and checkbox
  if (question.type === "multipleChoice" || question.type === "checkbox") {
    return (
      <>
        <Box ref={chartRef} height={300}>
          {chartType === "pie" ? (
            <ResponsivePie
              data={chartData.map(({ text, count, color }) => ({
                id: text,
                label: text,
                value: count,
                color,
              }))}
              colors={(d) => d.data.color}
              margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="#333"
            />
          ) : (
            <ResponsiveBar
              data={normalizedBarData}
              keys={["count"]}
              indexBy="answer"
              layout="horizontal"
              margin={{ top: 10, right: 20, bottom: 40, left: 120 }}
              padding={0.3}
              colors={({ data }) => data.color}
              enableLabel={false}
            />
          )}
        </Box>

        <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
          <ToggleButtonGroup
            size="small"
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
          >
            <ToggleButton value="bar">Horizontal Bar</ToggleButton>
            <ToggleButton value="pie">Pie Chart</ToggleButton>
          </ToggleButtonGroup>

          <Button variant="outlined" size="small" onClick={handleDownload}>
            Download PNG
          </Button>
        </Box>
      </>
    );
  }

  // Render bar chart for linear scale questions
  if (question.type === "linear") {
    return (
      <>
        <Box ref={chartRef} height={300}>
          <ResponsiveBar
            data={normalizedBarData}
            keys={["count"]}
            indexBy="answer"
            margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
            padding={0.3}
            colors={({ data }) => data.color}
            enableLabel={false}
          />
        </Box>

        <Box mt={1} display="flex" justifyContent="flex-end" alignItems="center">
          <Button variant="outlined" size="small" onClick={handleDownload}>
            Download PNG
          </Button>
        </Box>
      </>
    );
  }

  // Text type just shows count with no chart
  if (question.type === "text") {
    return (
      <Box mt={1}>
        <Typography variant="body2" color="text.secondary">
          {responses.length} text responses. Visualization not available.
        </Typography>
      </Box>
    );
  }

  return (
    <Typography variant="body2" color="error">
      Unsupported question type: {question.type}
    </Typography>
  );
};
