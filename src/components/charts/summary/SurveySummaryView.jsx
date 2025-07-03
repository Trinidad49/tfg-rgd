import {
  Typography,
  Box,
  CircularProgress,
  Divider,
  Container,
  Stack,
} from "@mui/material";
import { useSurveySummaryViewModel } from "../../../viewmodels/useSurveySummaryViewModel";
import { QuestionChart } from "./QuestionChart";

const SurveySummaryView = ({ survey }) => {
  const {
    answers,
    grouped, // consider renaming to processedResults
    insights,
    summaryRef,
    getChartData,
  } = useSurveySummaryViewModel(survey);

  if (answers === null) return <CircularProgress />;
  if (answers.length === 0)
    return <Typography>No responses yet for this survey.</Typography>;

  // Filter questions to only those that have chartable data (exclude text, empty)
  const chartableQuestions = survey.questions.filter((q) => {
    if (q.type === "text") return false;
    const responses = grouped[q.text];
    return responses && responses.length > 0;
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Summary: {survey.title}</Typography>
      </Box>

      <Box ref={summaryRef}>
        <Box mb={3}>
          <Typography>Total responses: {insights.totalResponses}</Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={6}>
          {chartableQuestions.map((question) => {
            const responses = grouped[question.text];
            const chartData = getChartData(responses, question.type);

            return (
              <Box
                key={question._id}
                sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}
              >
                <Typography variant="h6" gutterBottom>
                  {question.text}
                </Typography>
                <QuestionChart
                  question={question}
                  responses={responses}
                  chartData={chartData}
                />
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Container>
  );
};

export default SurveySummaryView;
