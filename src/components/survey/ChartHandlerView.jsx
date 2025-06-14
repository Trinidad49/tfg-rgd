import { Autocomplete, TextField, Typography } from "@mui/material";
import { GenerateChart } from "../charts/GenerateChart.jsx";
import useChartViewModel from "../../viewmodels/useChartViewModel.js";

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

  if (loading) return <Typography>Loading...</Typography>;

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

      {chartData && (
        <GenerateChart
          data={chartData}
          text={currentTitle}
          optional={optionalData}
        />
      )}
    </>
  );
}

export default ChartHandlerView;