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
        console.log(surveyData);
        console.log(survey);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };

    fetchData();
  }, []);

  if (!surveyData) {
    return <Typography>Loading... </Typography>;
  }

  return (
    <div>
      <Typography variant="h4">{survey.title}</Typography>
      {/* Render survey data */}
    </div>
  );
};
