import React, { useEffect, useState, useRef } from "react";
import { Box, MenuItem, Select, Stack, TextField, Button } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const baseColorPalette = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ac",
];
const generateColor = (index) => `hsl(${index * 30}, 70%, 50%)`;

export const GenerateChart = ({ data, text }) => {
  const [chartType, setChartType] = useState("bar");
  const [title, setTitle] = useState(text);
  const [xAxisTitle, setXAxisTitle] = useState("X Axis");
  const [yAxisTitle, setYAxisTitle] = useState("Y Axis");

  const chartRef = useRef(null);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (Array.isArray(data)) {
      const colors =
        data.length > baseColorPalette.length
          ? [
              ...baseColorPalette,
              ...Array.from(
                { length: data.length - baseColorPalette.length },
                (_, i) => generateColor(i)
              ),
            ]
          : baseColorPalette;

      setChartData({
        labels: data.map((a) => a.text),
        datasets: [
          {
            label: title,
            data: data.map((a) => a.count),
            backgroundColor:
              chartType === "donut" ? colors.slice(0, data.length) : "green",
          },
        ],
      });
    }
  }, [data, title, chartType]);

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const renderChart = () => {
    const commonOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
    };

    switch (chartType) {
      case "barh":
        return (
          <Bar
            ref={chartRef}
            data={chartData}
            options={{
              ...commonOptions,
              indexAxis: "y",
              scales: {
                x: {
                  title: {
                    display: true,
                    text: xAxisTitle,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: yAxisTitle,
                  },
                },
              },
            }}
          />
        );
      case "bar":
        return (
          <Bar
            ref={chartRef}
            data={chartData}
            options={{
              ...commonOptions,
              indexAxis: "x",
              scales: {
                x: {
                  title: {
                    display: true,
                    text: xAxisTitle,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: yAxisTitle,
                  },
                },
              },
            }}
          />
        );
      case "donut":
        return (
          <Pie
            ref={chartRef}
            data={chartData}
            options={{
              ...commonOptions,
              cutout: "40%",
            }}
          />
        );
      default:
        return null;
    }
  };

  const downloadChart = () => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const url = chart.toBase64Image();
      const link = document.createElement("a");
      link.href = url;
      link.download = "chart.png";
      link.click();
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box width="100%" maxWidth={800} maxHeight={600}>
        {renderChart()}
      </Box>
      <Stack direction="row" spacing={2} marginBottom={2} marginTop={3}>
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
        <Button variant="contained" onClick={downloadChart}>
          Download Chart as PNG
        </Button>
      </Stack>
    </Box>
  );
};
