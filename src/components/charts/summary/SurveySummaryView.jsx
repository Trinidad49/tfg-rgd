import React, { useEffect, useRef, useState } from "react";
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
import { fetchSurveyAnswers } from "../../../services/answerService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const baseColorPalette = [
  "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f",
  "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ac",
];

const SurveySummaryView = ({ survey }) => {
  const [answers, setAnswers] = useState(null);
  const summaryRef = useRef();

  useEffect(() => {
    setAnswers(null);
    fetchSurveyAnswers(survey._id)
      .then(setAnswers)
      .catch((err) => {
        console.error("Error fetching answers:", err);
        setAnswers([]);
      });
  }, [survey._id]);

  const groupAnswersByQuestion = (answers) => {
    const grouped = {};
    for (const response of answers) {
      for (const { text, answer } of response.answers) {
        if (!grouped[text]) grouped[text] = [];
        grouped[text].push(answer);
      }
    }
    return grouped;
  };

  const buildBarChartData = (responses) => {
    const counts = {};
    responses.forEach((r) => {
      counts[r] = (counts[r] || 0) + 1;
    });

    return Object.entries(counts).map(([label, value], i) => ({
      answer: label,
      count: value,
      color: baseColorPalette[i % baseColorPalette.length],
    }));
  };

  const getInsights = (grouped) => {
    const questionWithMostResponses = Object.entries(grouped).reduce(
      (max, entry) => (entry[1].length > max[1].length ? entry : max),
      ["", []]
    );

    const avgPerQuestion = Object.entries(grouped).map(([q, responses]) => ({
      question: q,
      avg:
        responses.every((a) => !isNaN(Number(a)))
          ? (
              responses.reduce((acc, val) => acc + Number(val), 0) /
              responses.length
            ).toFixed(2)
          : null,
    }));

    return {
      totalResponses: answers.length,
      mostAnswered: questionWithMostResponses[0],
      avgPerQuestion,
    };
  };

const handleExportPDF = async () => {
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 40;
  const usableWidth = pageWidth - margin * 2;

  const container = summaryRef.current;

  const headerNode = container.children[0];
  const headerCanvas = await html2canvas(headerNode, { scale: 2 });
  const headerImg = headerCanvas.toDataURL("image/png");
  let headerHeight = (headerCanvas.height * usableWidth) / headerCanvas.width;

  pdf.addImage(headerImg, "PNG", margin, margin, usableWidth, headerHeight);
  let currentHeight = margin + headerHeight + 20;

  const questionsContainer = container.children[2];

  for (let i = 0; i < questionsContainer.children.length; i++) {
    const questionNode = questionsContainer.children[i];
    const canvas = await html2canvas(questionNode, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const imgHeight = (canvas.height * usableWidth) / canvas.width;

    if (currentHeight + imgHeight > pageHeight - margin) {
      pdf.addPage();
      currentHeight = margin;
    }
    pdf.addImage(img, "PNG", margin, currentHeight, usableWidth, imgHeight);
    currentHeight += imgHeight + 20;
  }

  pdf.save(`${survey.title}_summary.pdf`);
};



  if (answers === null) return <CircularProgress />;
  if (answers.length === 0)
    return <Typography>No responses yet for this survey.</Typography>;

  const grouped = groupAnswersByQuestion(answers);
  const insights = getInsights(grouped);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Summary: {survey.title}</Typography>
        <Button variant="outlined" onClick={handleExportPDF}>
          Export as PDF
        </Button>
      </Box>

      <Box ref={summaryRef}>
        {/* Insights */}
        <Box mb={3}>
          <Typography variant="h6">Insights</Typography>
          <Typography>- Total responses: {insights.totalResponses}</Typography>
          <Typography>
            - Most answered question: {insights.mostAnswered || "N/A"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Chart Section */}
        <Stack spacing={4}>
          {survey.questions.map((question) => {
            const responses = grouped[question.text];
            if (!responses || responses.length === 0) return null;

            const chartData = buildBarChartData(responses);

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
