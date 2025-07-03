import React, { useRef, useState, useEffect } from "react";
import {
    Box,
    Button,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { toPng } from "html-to-image";
import { ChartTable } from "../ChartTable";

export const QuestionChart = ({ question, responses, chartData }) => {
    const chartRef = useRef(null);
    const tableRef = useRef(null);
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
        const refToExport = chartType === "table" ? tableRef.current : chartRef.current;
        if (!refToExport) return;

        // Wait for table layout to stabilize before exporting
        setTimeout(() => {
            toPng(refToExport)
                .then((dataUrl) => {
                    const link = document.createElement("a");
                    const safeTitle = question.text.replace(/[<>:"/\\|?*]+/g, "_");
                    link.href = dataUrl;
                    link.download = `${safeTitle}_${chartType}.png`;
                    link.click();
                })
                .catch((error) => {
                    console.error("Error generating image:", error);
                });
        }, 100);

    };

    const renderChart = () => {
        if (chartType === "pie") {
            return (
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
            );
        }

        if (chartType === "bar") {
            return (
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
            );
        }

        return <ChartTable ref={tableRef} data={chartData} chartType={chartType} />;
    };

    const isTable = chartType === "table";

    return (
        <>
            <Box
                ref={isTable ? tableRef : chartRef}
                sx={{
                    ...(isTable ? {} : { height: 300 }),
                    overflow: isTable ? "visible" : ""
                }}
            >
                {renderChart()}
            </Box>

            <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                <ToggleButtonGroup
                    size="small"
                    value={chartType}
                    exclusive
                    onChange={handleChartTypeChange}
                >
                    {question.type !== "linear" && <ToggleButton value="pie">Pie Chart</ToggleButton>}
                    <ToggleButton value="bar">Bar Chart</ToggleButton>
                    <ToggleButton value="table">Table</ToggleButton>
                </ToggleButtonGroup>

                <Button variant="outlined" size="small" onClick={handleDownload}>
                    Download PNG
                </Button>
            </Box>
        </>
    );
};
