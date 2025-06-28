import { Autocomplete, TextField, Typography } from "@mui/material";
import { GenerateChart } from "../charts/GenerateChart.jsx";
import useChartViewModel from "../../viewmodels/useChartViewModel.js";
import { useState } from "react";
import ChartFilterPanel from "../charts/ChartFilterPanel.jsx";

function ChartHandlerView({ survey }) {
  const [chartType, setChartType] = useState("barh");
  const [filters, setFilters] = useState({});

  const {
    loading,
    chartData,
    currentTitle,
    optionalData,
    questions,
    handleQuestionChange,
    handleOptionalChange,
    selectedOptionalQuestion,
  } = useChartViewModel(survey, filters);

  const showOptional = chartType === "stackedBar" || chartType === "groupedBar";

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        style={{
          flex: "0 0 450px",
          paddingRight: 20,
          borderRight: "1px solid #ccc",
          overflowY: "auto",
        }}
      >
        <Autocomplete
          options={questions}
          getOptionLabel={(o) => o.text}
          onChange={(_, value) => value && handleQuestionChange(value)}
          renderInput={(params) => (
            <TextField {...params} label="Select Question" variant="outlined" />
          )}
          style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
        />

        {showOptional && (
          <Autocomplete
            options={questions}
            getOptionLabel={(o) => o.text}
            value={selectedOptionalQuestion || null}
            onChange={(_, value) => value && handleOptionalChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Optional Question"
                variant="outlined"
              />
            )}
            style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
          />
        )}

        <ChartFilterPanel
          questions={questions}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <div
        style={{
          flex: 1,
          paddingLeft: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
        }}
      >
        {(chartData || optionalData) && (
          <GenerateChart
            data={chartData}
            text={currentTitle}
            optional={showOptional ? optionalData : null}
            chartType={chartType}
            setChartType={setChartType}
          />
        )}
      </div>
    </div>
  );
}

export default ChartHandlerView;
