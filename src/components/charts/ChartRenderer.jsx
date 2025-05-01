import React from "react";
import { Typography } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { formatHorizontalBarData, formatStackedBarData, formatDonutData } from "./chartUtils";

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
    case "stackedBar": {
      if (!optional || optional.length === 0 || !optional[0].options) {
        return <Typography color="error">Please select an optional question to render a stacked bar chart.</Typography>;
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
    case "bar": {
      const totalCount = data.reduce((acc, d) => acc + d.count, 0);
      const chartData = data.map((d) => ({
        ...d,
        percentage: ((d.count / totalCount) * 100).toFixed(2) + "%",
      }));
      return (
        <ResponsiveBar
          data={chartData}
          keys={["count"]}
          indexBy="text"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          colors={{ datum: "data.color" }}
          axisBottom={{
            legend: title,
            legendPosition: "middle",
            legendOffset: 32,
          }}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          label={(d) => d.data.percentage}
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
