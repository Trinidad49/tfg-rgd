import {
  Autocomplete,
  TextField,
  Typography,
  Box
} from "@mui/material";
import useChartViewModel from "../../../viewmodels/useChartViewModel.js";
import { MultiChart } from "./MultiChart.jsx";

function MultiHandlerView({ surveyA, surveyB }) {
  const {
    loading: loadingA,
    chartData: dataA,
    questions: questionsA,
    handleQuestionChange: handleQuestionA,
  } = useChartViewModel(surveyA);

  const {
    loading: loadingB,
    chartData: dataB,
    questions: questionsB,
    handleQuestionChange: handleQuestionB,
  } = useChartViewModel(surveyB);

  const chartType = "groupedBar";

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
              <TextField
                {...params}
                label={`Question from ${surveyA.title}`}
                variant="outlined"
              />
            )}
            fullWidth
          />
        </Box>

        <Box flex={1} minWidth={250}>
          <Autocomplete
            options={questionsB}
            getOptionLabel={(o) => o.text}
            onChange={(_, value) => value && handleQuestionB(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={`Question from ${surveyB.title}`}
                variant="outlined"
              />
            )}
            fullWidth
          />
        </Box>
      </Box>
      {dataA && dataB && (
        <Box mt={4}>
          <MultiChart
            dataA={dataA}
            dataB={dataB}
            chartType={chartType}
          />
        </Box>
      )}
    </>
  );
}

export default MultiHandlerView;
