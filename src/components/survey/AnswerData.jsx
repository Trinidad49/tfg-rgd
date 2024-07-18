import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { GenerateCSV } from "../csv/GenerateCSV";

export const AnswerData = ({ survey }) => {
  const [surveyData, setSurveyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3080/answers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            surveyid: survey._id,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch answer data");
        }
        const data = await response.json();
        setSurveyData(data);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };
    fetchData();
  }, [survey._id]);

  if (!surveyData) {
    return <Typography>Loading... </Typography>;
  }

  const getAnswerCount = (optionText, questionIndex) =>
    survey.questions[questionIndex].type === "checkbox"
      ? surveyData.filter((a) =>
          a.answers[questionIndex]?.answer.includes(optionText)
        ).length
      : surveyData.filter(
          (a) => a.answers[questionIndex]?.answer === optionText
        ).length;

  console.log(surveyData.length);
  return (
    <Paper style={{ backgroundColor: "white", margin: 10, padding: 30 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Typography variant="h4">{survey.title}</Typography>
          <Typography variant="h6">
            Total of answers:{surveyData.length}
          </Typography>
        </div>
        <GenerateCSV survey={survey} surveyData={surveyData} />
      </div>
      <Divider style={{ marginBottom: 20, marginTop: 10 }} />
      {survey.questions.map((question, index) => (
        <Card key={index} variant="outlined" style={{ marginBottom: "16px" }}>
          <CardContent>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Typography variant="h6">{question.text}</Typography>
            </div>
            {question.type === "text" ? (
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {surveyData.map((answers, i) => (
                  <div key={i}>
                    <Typography>{answers.answers[index]?.answer}</Typography>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {question.answers.map((option, optionIndex) => (
                  <div key={optionIndex} style={{ marginBottom: "8px" }}>
                    <Typography>{option.text}</Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (getAnswerCount(option.text, index) /
                            surveyData.length) *
                          100
                        }
                        style={{ marginRight: "8px", flexGrow: 1 }}
                      />
                      <Typography>
                        {getAnswerCount(option.text, index)}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </Paper>
  );
};
