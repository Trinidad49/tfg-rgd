import React, { useState } from "react";
import Plot from "react-plotly.js";
import { Box, MenuItem, Select, Stack, TextField } from "@mui/material";

export const GenerateChart = ({ data, text }) => {
  const [chartType, setChartType] = useState("bar");
  const [title, setTitle] = useState(text);
  const [xAxisTitle, setXAxisTitle] = useState("X Axis");
  const [yAxisTitle, setYAxisTitle] = useState("Y Axis");

  const [countArray] = useState(
    Array.isArray(data) ? data.map((a) => a.count) : []
  );
  const [textArray] = useState(
    Array.isArray(data) ? data.map((a) => a.text) : []
  );

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const renderChart = () => {
    switch (chartType) {
      case "barh":
        return (
          <Plot
            data={[
              {
                x: countArray,
                y: textArray,
                type: "bar",
                orientation: "h",
                marker: { color: "green" },
                name: "Horizontal Bar Chart",
              },
            ]}
            layout={{
              title: title,
              xaxis: { title: xAxisTitle, tickmode: "linear" },
              yaxis: { title: yAxisTitle },
              hovermode: false,
            }}
          />
        );
      case "bar":
        return (
          <Plot
            data={[
              {
                x: textArray,
                y: countArray,
                type: "bar",
                marker: { color: "green" },
                name: "Bar Chart",
              },
            ]}
            layout={{
              title: title,
              xaxis: { title: xAxisTitle },
              yaxis: { title: yAxisTitle, tickmode: "linear" },
              hovermode: false,
            }}
          />
        );
      case "donut":
        return (
          <Plot
            data={[
              {
                values: countArray,
                labels: textArray,
                type: "pie",
                hole: 0.4,
                name: "Donut Chart",
              },
            ]}
            layout={{
              title: title,
              hovermode: false,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box>{renderChart()}</Box>
      <Stack direction="row" spacing={2} marginBottom={2}>
        <Select
          value={chartType}
          onChange={(e) => handleChartTypeChange(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="barh">Horizontal Bar</MenuItem>
          <MenuItem value="bar">Bar</MenuItem>
          <MenuItem value="donut">Donut</MenuItem>
        </Select>
        <TextField
          label="Chart Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {chartType !== "donut" && (
          <>
            <TextField
              label="X Axis Title"
              value={xAxisTitle}
              onChange={(e) => setXAxisTitle(e.target.value)}
            />
            <TextField
              label="Y Axis Title"
              value={yAxisTitle}
              onChange={(e) => setYAxisTitle(e.target.value)}
            />
          </>
        )}
      </Stack>
    </Box>
  );
};
