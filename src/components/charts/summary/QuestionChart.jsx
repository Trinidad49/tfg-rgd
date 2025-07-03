import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { toPng } from "html-to-image";

export const QuestionChart = ({ question, responses, chartData }) => {
    const chartRef = useRef(null);
    const [chartType, setChartType] = useState("bar");

    useEffect(() => {
        if (question.type === "multipleChoice") {
            setChartType("pie");
        } else if (question.type === "checkbox") {
            setChartType("bar");
        } else if (question.type === "linear") {
            setChartType("bar");
        }
    }, [question.type]);

    const normalizedBarData = chartData.map(({ id, label, value, color }) => ({
        answer: id || label,
        count: value,
        color,
    }));

    const handleChartTypeChange = (_, newType) => {
        if (newType !== null) setChartType(newType);
    };

    const handleDownload = () => {
        if (chartRef.current) {
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
        }
    };

    if (question.type === "multipleChoice" || question.type === "checkbox") {
        return (
            <>
                <Box ref={chartRef} height={300}>
                    {chartType === "pie" ? (
                        <ResponsivePie
                            data={chartData}
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

                <Box
                    mt={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
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

  if (question.type === "linear") {
    return (
      <>
        <Box ref={chartRef} height={300}>
          <ResponsiveBar
            data={chartData}
            keys={["count"]}
            indexBy="answer"
            margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
            padding={0.3}
            colors={({ data }) => data.color}
            enableLabel={false}
          />
        </Box>

        <Box
          mt={1}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Button variant="outlined" size="small" onClick={handleDownload}>
            Download PNG
          </Button>
        </Box>
      </>
    );
  }

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
