import React from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Divider,
  Button,
  Container,
  Stack,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { useSurveySummaryViewModel } from "../../../viewmodels/useSurveySummaryViewModel";

const SurveySummaryView = ({ survey }) => {
  const {
    answers,
    grouped,
    insights,
    summaryRef,
    handleExportPDF,
    getChartData,
  } = useSurveySummaryViewModel(survey);

  if (answers === null) return <CircularProgress />;
  if (answers.length === 0)
    return <Typography>No responses yet for this survey.</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Summary: {survey.title}</Typography>
        <Button variant="outlined" onClick={handleExportPDF}>
          Export as PDF
        </Button>
      </Box>

      <Box ref={summaryRef}>
        <Box mb={3}>
          <Typography>Total responses: {insights.totalResponses}</Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={4}>
          {survey.questions.map((question) => {
            const responses = grouped[question.text];
            if (!responses || responses.length === 0) return null;

            const chartData = getChartData(responses);

            return (
              <Box key={question._id}>
                <Typography variant="subtitle1" gutterBottom>
                  {question.text}
                </Typography>

                {question.type === "multipleChoice" && (
                  <Box height={260}>
                    <ResponsiveBar
                      data={chartData}
                      keys={["count"]}
                      indexBy="answer"
                      margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
                      padding={0.3}
                      colors={({ data }) => data.color}
                      enableLabel={false}
                      axisBottom={{
                        tickRotation: 0,
                        legend: "Answer",
                        legendPosition: "middle",
                        legendOffset: 32,
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        legend: "Count",
                        legendPosition: "middle",
                        legendOffset: -40,
                      }}
                    />
                  </Box>
                )}

                {question.type === "linear" && (
                  <Box mt={1}>
                    <Typography variant="body2">
                      Avg. Score:{" "}
                      {(
                        responses.reduce(
                          (acc, val) => acc + parseInt(val, 10),
                          0
                        ) / responses.length
                      ).toFixed(2)}{" "}
                      ({responses.length} responses)
                    </Typography>
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Container>
  );
};

export default SurveySummaryView;
