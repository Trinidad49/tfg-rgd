import { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";

export const AnswerSurvey = ({ surveyID }) => {
  const [surveyData, setSurveyData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

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
          // Initialize userAnswers state with empty answers for each question
          setUserAnswers(data[0].questions.map(() => ({ answer: "" })));
        }
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };
    fetchSurveys();
  }, [surveyID]);

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers((prevUserAnswers) => {
      const updatedAnswers = [...prevUserAnswers];
      updatedAnswers[questionIndex] = { answer };
      return updatedAnswers;
    });
  };

  const handleSaveAnswers = () => {
    // Combine survey ID with user answers for submission
    const surveyWithAnswers = {
      surveyID,
      questions: surveyData.questions.map((question, index) => ({
        text: question.text,
        answer: userAnswers[index].answer,
      })),
    };

    // Implement logic to save survey
    console.log("Answers saved:", surveyWithAnswers);
  };

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Typography variant="h3">{surveyData.title}</Typography>
        </Grid>
        {surveyData.questions.map((question, index) => (
          <Grid item key={index}>
            <Typography variant="h5">{question.text}</Typography>
            {question.type === "text" ? (
              <TextField
                label="Your Answer"
                value={userAnswers[index].answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                fullWidth
                margin="normal"
              />
            ) : (
              <TextField
                select
                label="Select Answer"
                value={userAnswers[index].answer}
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
          </Grid>
        ))}
        <Grid item>
          <Button variant="contained" onClick={handleSaveAnswers}>
            Save Answers
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
