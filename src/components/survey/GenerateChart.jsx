import React, { useState, useRef } from "react";
import { Box, Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { toPng } from "html-to-image";

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

const getTextWidth = (text, font = "16px Arial") => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

export const GenerateChart = ({ text, data, optional }) => {
  const [chartType, setChartType] = useState("bar");
  const [title, setTitle] = useState(text);
  const chartRef = useRef(null);

  const formattedData = data.map((d, i) => ({
    id: d.text,
    label: d.text,
    value: d.count,
    color:
      data.length > baseColorPalette.length
        ? generateColor(i)
        : baseColorPalette[i],
  }));

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const downloadChart = () => {
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

  const renderChart = () => {
    switch (chartType) {
      case "barh":
        const longestLabelWidth = Math.max(
          ...formattedData.map((d) => getTextWidth(d.id))
        );
        const leftMargin = longestLabelWidth + 20;

        return (
          <ResponsiveBar
            data={formattedData}
            keys={["value"]}
            indexBy="id"
            margin={{ top: 50, right: 130, bottom: 50, left: leftMargin }}
            padding={0.3}
            layout="horizontal"
            colors={({ id, data }) => data.color}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Count",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          />
        );
      case "stackedBar":
        const keys = Object.keys(optional[0].options);

        const totalValues = optional.map((data) => {
          const total = keys.reduce((sum, key) => sum + data.options[key], 0);
          return total;
        });

        const percentageData = optional.map((data, i) => {
          const total = totalValues[i];
          const percentageObject = {};
          keys.forEach((key) => {
            percentageObject[key] = (data.options[key] / total) * 100;
          });
          return {
            category: data.text,
            ...percentageObject,
          };
        });

        return (
          <ResponsiveBar
            data={percentageData}
            keys={keys}
            indexBy="category"
            margin={{ top: 50, right: 30, bottom: 50, left: 200 }}
            padding={0.3}
            layout="horizontal"
            colors={{ scheme: "nivo" }}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            enableLabel={false}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Percentage",
              legendPosition: "middle",
              legendOffset: 32,
              format: (d) => `${d}%`,
            }}
          />
        );

      case "bar":
        const totalCount = formattedData.reduce(
          (acc, data) => acc + data.value,
          0
        );

        return (
          <ResponsiveBar
            data={formattedData.map((d) => ({
              ...d,
              percentage: ((d.value / totalCount) * 100).toFixed(2) + "%",
            }))}
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            xScale={{ type: "band", padding: 0.2 }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: title,
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={null}
            colors={{ datum: "data.color" }}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            label={(d) => `${d.data.percentage}`}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={(e) =>
              `${e.id}: ${e.formattedValue} in country: ${e.indexValue}`
            }
          />
        );
      case "donut":
        return (
          <ResponsivePie
            data={formattedData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={({ id, data }) => data.color}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            radialLabelsSkipAngle={10}
            radialLabelsTextColor="#333333"
            radialLabelsLinkColor={{ from: "color" }}
            sliceLabelsSkipAngle={10}
            sliceLabelsTextColor="#333333"
            sliceLabel={({ value }) => `${value}%`}
            tooltip={({ datum }) => (
              <div style={{ padding: 12, color: "#000", background: "#fff" }}>
                <strong>{datum.label}</strong>: {datum.value}%
              </div>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box width="100%" maxWidth={800} height={600} ref={chartRef}>
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
          <MenuItem value="stackedBar">StackedBar</MenuItem>
        </Select>
        <TextField
          label="Chart Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button variant="contained" onClick={downloadChart}>
          Download Chart as PNG
        </Button>
      </Stack>
    </Box>
  );
};
