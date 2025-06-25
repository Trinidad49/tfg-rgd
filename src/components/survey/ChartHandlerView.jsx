import { Autocomplete, TextField, Typography } from "@mui/material";
import { GenerateChart } from "../charts/GenerateChart.jsx";
import useChartViewModel from "../../viewmodels/useChartViewModel.js";
import { useEffect, useState } from "react";
import ChartFilterPanel from "../charts/ChartFilterPanel.jsx";
function ChartHandlerView({ survey }) {
  const {
    loading,
    chartData,
    currentTitle,
    optionalData,
    questions,
    handleQuestionChange,
    handleOptionalChange,
  } = useChartViewModel(survey);

  const [chartType, setChartType] = useState("barh");
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const showOptional = chartType === "stackedBar" || chartType === "groupedBar";

  useEffect(() => {
    if (showOptional && optionalData?.length) {
      const optionKeys = Object.keys(optionalData[0].options || {});
      setFilterOptions(optionKeys);
      setSelectedAnswers(optionKeys);
    } else if (chartData?.length) {
      const labels = chartData.map((d) => d.text);
      setFilterOptions(labels);
      setSelectedAnswers(labels);
    }
  }, [chartData, optionalData, chartType]);

  if (loading) return <Typography>Loading...</Typography>;

  const filteredData =
    !showOptional && chartData
      ? chartData.filter((item) => selectedAnswers.includes(item.text))
      : chartData;

  const filteredOptional =
    showOptional && optionalData
      ? optionalData.map((item) => {
          const filteredOptions = Object.entries(item.options || {})
            .filter(([key]) => selectedAnswers.includes(key))
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
          return { ...item, options: filteredOptions };
        })
      : optionalData;

  return (
    <>
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

      {(chartData || optionalData) && (
        <>
          <ChartFilterPanel
            filterOptions={filterOptions}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
          />
          <GenerateChart
            data={filteredData}
            text={currentTitle}
            optional={filteredOptional}
            chartType={chartType}
            setChartType={setChartType}
          />
        </>
      )}
    </>
  );
}

export default ChartHandlerView;
