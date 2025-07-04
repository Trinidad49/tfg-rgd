import React from "react";
import { Typography, Box } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { formatHorizontalBarData, formatStackedBarData, formatDonutData, formatGroupedBarData } from "./chartUtils";
const baseColorPalette = [
  "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f",
  "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ac",
];
export const ChartRenderer = ({ type, data, optional, title }) => {
  switch (type) {
    case "barh": {
      const { formattedData, leftMargin } = formatHorizontalBarData(data);
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
          axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        />
      );
    }
    case "bar": {
      const totalCount = data.reduce((acc, d) => acc + d.count, 0);
      const chartData = data.map((d, i) => ({
        id: d.text,
        label: d.text,
        value: d.count,
        percentage: ((d.count / totalCount) * 100).toFixed(2) + "%",
        color: baseColorPalette[i % baseColorPalette.length],
      }));
      return (
        <ResponsiveBar
          data={chartData}
          keys={["value"]}
          indexBy="id"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          colors={({ id, data }) => data.color}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisBottom={{
            legend: title,
            legendPosition: "middle",
            legendOffset: 32,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          label={(d) => d.data.percentage}
        />
      );
    }
    case "groupedBar": {
      if (!optional || optional.length === 0 || !optional[0].options) {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
            textAlign="center"
          >
            <Typography variant="h6" color="error">
              Please select an optional question to display this chart.
            </Typography>
          </Box>
        );
      }

      const groupedData = optional.map((item) => ({
        group: item.text,
        values: item.options,
      }));

      const { formattedData, keys } = formatGroupedBarData(groupedData);

      return (
        <ResponsiveBar
          data={formattedData}
          keys={keys}
          indexBy="group"
          margin={{ top: 50, right: 130, bottom: 50, left: 80 }}
          padding={0.3}
          groupMode="grouped"
          colors={{ scheme: "category10" }}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisBottom={{
            legend: title,
            legendPosition: "middle",
            legendOffset: 32,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              translateX: 120,
              itemWidth: 100,
              itemHeight: 20,
              itemsSpacing: 2,
              symbolSize: 20,
            },
          ]}
        />
      );
    }
    case "stackedBar": {
      if (!optional || optional.length === 0 || !optional[0].options) {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
            textAlign="center"
          >
            <Typography variant="h6" color="error">
              Please select an optional question to display this chart.
            </Typography>
          </Box>
        );
      }
      const { stackedData, keys } = formatStackedBarData(optional);
      return (
        <ResponsiveBar
          data={stackedData}
          keys={keys}
          indexBy="category"
          margin={{ top: 50, right: 130, bottom: 50, left: 200 }}
          padding={0.3}
          layout="horizontal"
          colors={{ scheme: "nivo" }}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
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
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              translateX: 120,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              symbolSize: 20,
            },
          ]}
        />
      );
    }
    case "groupedBarH": {
      if (!optional || optional.length === 0 || !optional[0].options) {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
            textAlign="center"
          >
            <Typography variant="h6" color="error">
              Please select an optional question to display this chart.
            </Typography>
          </Box>
        );
      }

      const groupedData = optional.map((item) => ({
        group: item.text,
        values: item.options,
      }));

      const { formattedData, keys } = formatGroupedBarData(groupedData);

      return (
        <ResponsiveBar
          data={formattedData}
          keys={keys}
          indexBy="group"
          margin={{ top: 50, right: 130, bottom: 50, left: 150 }}
          padding={0.3}
          layout="horizontal"
          groupMode="grouped"
          colors={{ scheme: "category10" }}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              translateX: 120,
              itemWidth: 100,
              itemHeight: 20,
              itemsSpacing: 2,
              symbolSize: 20,
            },
          ]}
        />
      );
    }


    case "donut": {
      const pieData = formatDonutData(data);
      return (
        <ResponsivePie
          data={pieData}
          margin={{ top: 40, right: 100, bottom: 80, left: 100 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={({ id, data }) => data.color}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          sliceLabelsSkipAngle={10}
          sliceLabel={({ value }) => `${value}%`}
          tooltip={({ datum }) => (
            <div style={{ padding: 12, background: "#fff" }}>
              <strong>{datum.label}</strong>: {datum.value}%
            </div>
          )}
        />
      );
    }
    default:
      return null;
  }
};
