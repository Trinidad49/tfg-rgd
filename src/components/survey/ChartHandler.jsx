import { Autocomplete, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GenerateChart } from "./GenerateChart";
const backUrl = process.env.REACT_APP_BACK

export const ChartHandler = ({ survey }) => {
  const [surveyData, setSurveyData] = useState(null);
  const [chartData, setChartData] = useState();
  const [currentTitle, setCurrentTitle] = useState();
  const [optionalData, setOptionalData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(backUrl+"/answers", {
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

  const handleOptionalChange = (event, value) => {
    if (value) {
      const index = survey.questions.findIndex((q) => q.text === value.text);
      if (index !== -1) {
        const optionTexts = survey.questions[index].answers.map(
          (answer) => answer.text
        );

        const auxData = chartData.map((item) => {
          const options = optionTexts.reduce((acc, text) => {
            acc[text] = 0;
            return acc;
          }, {});

          return {
            ...item,
            options: options,
          };
        });

        populateAuxData(
          auxData,
          currentTitle,
          survey.questions[index].text,
          surveyData
        );
        setOptionalData(auxData);
      }
    }
  };

  const populateAuxData = (auxData, title1, title2, newArray) => {
    newArray.forEach((obj) => {
      const answer1 = obj.answers.find(
        (answer) => answer.text === title1
      )?.answer;
      const answer2 = obj.answers.find(
        (answer) => answer.text === title2
      )?.answer;

      if (answer1 && answer2) {
        const auxItem = auxData.find((item) => item.text === answer1);
        if (auxItem && auxItem.options.hasOwnProperty(answer2)) {
          auxItem.options[answer2] += 1;
        }
      }
    });
  };

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
      <Autocomplete
        options={survey.questions}
        getOptionLabel={(option) => option.text}
        onChange={handleOptionalChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Optional Question"
            variant="outlined"
          />
        )}
        style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
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
};
