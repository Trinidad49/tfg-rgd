import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

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

  return (
    <div>
      <Typography variant="h4">{survey.title}</Typography>
      {survey.questions.map((question, index) => (
        <div key={index}>
          <Typography variant="h6">{question.text}</Typography>
          {question.type === "text" ? (
            <div>
              {surveyData.map((answers, i) => (
                <div key={i}>
                  <Typography>{answers.answers[index].answer}</Typography>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {question.answers.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <Typography>{option.text}</Typography>
                  <Typography>
                    Count:{" "}
                    {
                      surveyData.filter(
                        (a) => a.answers[index].answer === option.text
                      ).length
                    }
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
