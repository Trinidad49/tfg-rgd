import { Autocomplete, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GenerateChart } from "./GenerateChart";

export const ChartHandler = ({ survey }) => {
  const [surveyData, setSurveyData] = useState(null);
  const [chartData, setChartData] = useState();
  const [currentTitle, setCurrentTitle] = useState();

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

  const getChartData = (index) => {
    const data = [];
    survey.questions[index].answers.forEach((a) =>
      data.push({ text: a.text, count: getAnswerCount(a.text, index) })
    );
    return data;
  };

  const handleQuestionChange = (event, value) => {
    if (value) {
      const index = survey.questions.findIndex((q) => q.text === value.text);
      if (index !== -1) {
        setCurrentTitle(survey.questions[index].text);
        setChartData(getChartData(index));
      }
    }
  };

  console.log("ChartData or CurrentTitle updated:", chartData, currentTitle);

  return (
    <>
      <Autocomplete
        options={survey.questions}
        getOptionLabel={(option) => option.text}
        onChange={handleQuestionChange}
        renderInput={(params) => (
          <TextField {...params} label="Select Question" variant="outlined" />
        )}
        style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
      />
      {chartData && <GenerateChart data={chartData} text={currentTitle} />}
    </>
  );
};
