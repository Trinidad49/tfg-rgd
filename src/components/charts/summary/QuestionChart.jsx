import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { toPng } from "html-to-image";

export const QuestionChart = ({ question, responses, chartData }) => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    if (question.type === "multipleChoice") setChartType("pie");
    else setChartType("bar");
  }, [question.type]);

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

  // Multiple choice and checkbox render with new "Table" toggle option
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
              style={{ display: chartType === "table" ? "none" : undefined }}
            />
          ) : chartType === "bar" ? (
            <ResponsiveBar
              data={normalizedBarData}
              keys={["count"]}
              indexBy="answer"
              layout="horizontal"
              margin={{ top: 10, right: 20, bottom: 40, left: 120 }}
              padding={0.3}
              colors={({ data }) => data.color}
              enableLabel={false}
              style={{ display: chartType === "table" ? "none" : undefined }}
            />
          ) : (
            // Show simple text if "table" selected
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="300px"
              fontSize="1.25rem"
              fontWeight="bold"
            >
              data
            </Box>
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
            <ToggleButton value="table">Table</ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            size="small"
            onClick={handleDownload}
            disabled={chartType === "table"} // Disable download when table view is active
          >
            Download PNG
          </Button>
        </Box>
      </>
    );
  }

  // Linear scale questions with added "Table" toggle
  if (question.type === "linear") {
    return (
      <>
        <Box ref={chartRef} height={300}>
          {chartType === "bar" ? (
            <ResponsiveBar
              data={normalizedBarData}
              keys={["count"]}
              indexBy="answer"
              margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
              padding={0.3}
              colors={({ data }) => data.color}
              enableLabel={false}
            />
          ) : (
            // Show text "data" when "table" selected
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="300px"
              fontSize="1.25rem"
              fontWeight="bold"
            >
              data
            </Box>
          )}
        </Box>

        <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
          <ToggleButtonGroup
            size="small"
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            sx={{ mr: 1 }}
          >
            <ToggleButton value="bar">Bar Chart</ToggleButton>
            <ToggleButton value="table">Table</ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            size="small"
            onClick={handleDownload}
            disabled={chartType === "table"} // Disable download for table view
          >
            Download PNG
          </Button>
        </Box>
      </>
    );
  }

  return (
    <Typography variant="body2" color="error">
      Unsupported question type: {question.type}
    </Typography>
  );
};
