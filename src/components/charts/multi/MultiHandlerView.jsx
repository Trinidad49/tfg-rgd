import {
  Autocomplete,
  TextField,
  Typography,
  Box
} from "@mui/material";
import { GenerateChart } from "../GenerateChart.jsx";
import useChartViewModel from "../../../viewmodels/useChartViewModel.js";
import { useState } from "react";

function MultiHandlerView({ surveyA, surveyB }) {
  const {
    loading: loadingA,
    chartData: dataA,
    currentTitle: titleA,
    optionalData: optionalA,
    questions: questionsA,
    handleQuestionChange: handleQuestionA,
    handleOptionalChange: handleOptionalA,
  } = useChartViewModel(surveyA);

  const {
    loading: loadingB,
    chartData: dataB,
    currentTitle: titleB,
    optionalData: optionalB,
    questions: questionsB,
    handleQuestionChange: handleQuestionB,
    handleOptionalChange: handleOptionalB,
  } = useChartViewModel(surveyB);

  const [chartType, setChartType] = useState("barh");

  const showOptional = chartType === "stackedBar" || chartType === "groupedBar";

  if (loadingA || loadingB) return <Typography>Loading surveys...</Typography>;

  return (
    <>
      <Box display="flex" gap={2} mt={3} flexWrap="wrap">
        <Box flex={1} minWidth={250}>
          <Autocomplete
            options={questionsA}
            getOptionLabel={(o) => o.text}
            onChange={(_, value) => value && handleQuestionA(value)}
            renderInput={(params) => (
              <TextField {...params} label={`Question from ${surveyA.title}`} variant="outlined" />
            )}
            fullWidth
          />
          {showOptional && (
            <Autocomplete
              options={questionsA}
              getOptionLabel={(o) => o.text}
              onChange={(_, value) => value && handleOptionalA(value)}
              renderInput={(params) => (
                <TextField {...params} label="Optional Question A" variant="outlined" />
              )}
              fullWidth
              sx={{ mt: 2 }}
            />
          )}
        </Box>

        <Box flex={1} minWidth={250}>
          <Autocomplete
            options={questionsB}
            getOptionLabel={(o) => o.text}
            onChange={(_, value) => value && handleQuestionB(value)}
            renderInput={(params) => (
              <TextField {...params} label={`Question from ${surveyB.title}`} variant="outlined" />
            )}
            fullWidth
          />
          {showOptional && (
            <Autocomplete
              options={questionsB}
              getOptionLabel={(o) => o.text}
              onChange={(_, value) => value && handleOptionalB(value)}
              renderInput={(params) => (
                <TextField {...params} label="Optional Question B" variant="outlined" />
              )}
              fullWidth
              sx={{ mt: 2 }}
            />
          )}
        </Box>
      </Box>

      {(dataA || dataB) && (
        <Box mt={4}>
          {/* For now, just show both charts one after the other.
              Later, you can create a custom `CompareChart` if needed. */}
          {dataA && (
            <GenerateChart
              data={dataA}
              text={titleA}
              optional={optionalA}
              chartType={chartType}
              setChartType={setChartType}
            />
          )}
          {dataB && (
            <GenerateChart
              data={dataB}
              text={titleB}
              optional={optionalB}
              chartType={chartType}
              setChartType={setChartType}
            />
          )}
        </Box>
      )}
    </>
  );
}

export default MultiHandlerView;
