import { useState, useEffect } from "react";
import { TextField, MenuItem, Button } from "@mui/material";

export const AnswerSurvey = ({ surveyID }) => {
  const [surveyData, setSurveyData] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch("http://localhost:3080/survey", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            surveyid: surveyID,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch surveys");
        }
        const data = await response.json();
        if (data.length > 0) {
          setSurveyData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };
    fetchSurveys();
  }, [surveyID]);

  const handleAnswerChange = (questionIndex, answer) => {
    const updatedSurveyData = { ...surveyData };
    updatedSurveyData.questions[questionIndex].answer = answer;
    setSurveyData(updatedSurveyData);
  };

  const handleSaveAnswers = () => {
    // Implement saving answers logic here
    console.log("Answers saved:", surveyData);
  };

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{surveyID}</h1>
      <h2>{surveyData.title}</h2>
      {surveyData.questions.map((question, index) => (
        <div key={index}>
          <h3>{question.text}</h3>
          {question.type === "text" ? (
            <TextField
              label="Your Answer"
              value={question.answer || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              fullWidth
              margin="normal"
            />
          ) : (
            <TextField
              select
              label="Select Answer"
              value={question.answer || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              fullWidth
              margin="normal"
            >
              {question.answers.map((option, optionIndex) => (
                <MenuItem key={optionIndex} value={option.text}>
                  {option.text}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>
      ))}{" "}
      <Button variant="contained" onClick={handleSaveAnswers}>
        Save Answers
      </Button>
    </div>
  );
};
