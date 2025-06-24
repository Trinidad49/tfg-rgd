import React from "react";
import { Typography } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";

export const MultiRenderer = ({ data, title, surveyATitle, surveyBTitle }) => {
  if (!data || data.length === 0) {
    return (
      <Typography color="error">
        No data available to render grouped bar chart.
      </Typography>
    );
  }

  const formattedData = data.map((item) => ({
    group: item.text,
    [surveyATitle]: item.A || 0,
    [surveyBTitle]: item.B || 0,
  }));

  const keys = [surveyATitle, surveyBTitle];

  return (
    <ResponsiveBar
      data={formattedData}
      keys={keys}
      indexBy="group"
      margin={{ top: 50, right: 130, bottom: 50, left: 80 }}
      padding={0.3}
      groupMode="grouped"
      colors={{ scheme: "nivo" }}
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
};
