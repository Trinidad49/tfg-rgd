import React, { useState } from "react";
import Plot from "react-plotly.js";
import { Button } from "@mui/material";

export const GenerateChart = (data) => {
  const [chartType, setChartType] = useState("bar");
  const [countArray] = useState(
    Array.isArray(data.data) ? data.data.map((a) => a.count) : []
  );
  const [textArray] = useState(
    Array.isArray(data.data) ? data.data.map((a) => a.text) : []
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
              title: "Horizontal Bar Chart",
              xaxis: { title: "X Axis", tickmode: "linear" },
              yaxis: { title: "Y Axis" },
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
              title: "Bar Chart",
              xaxis: { title: "X Axis" },
              yaxis: { title: "Y Axis", tickmode: "linear" },
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
              title: "Donut Chart",
              hovermode: false,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div>
        <Button
          variant={chartType === "barh" ? "contained" : "outlined"}
          onClick={() => handleChartTypeChange("barh")}
        >
          Horizontal Bar
        </Button>
        <Button
          variant={chartType === "bar" ? "contained" : "outlined"}
          onClick={() => handleChartTypeChange("bar")}
        >
          Bar
        </Button>
        <Button
          variant={chartType === "donut" ? "contained" : "outlined"}
          onClick={() => handleChartTypeChange("donut")}
        >
          Donut
        </Button>
      </div>
      {renderChart()}
    </div>
  );
};
