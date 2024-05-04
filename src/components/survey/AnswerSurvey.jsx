import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
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
          console.log(data[0].questions);
          setUserAnswers(
            data[0].questions.map((question) => ({
              answer: question.type === "checkbox" ? [] : "",
            }))
          );
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

  const handleSaveAnswers = async () => {
    // Combine survey ID with user answers for submission
    const surveyWithAnswers = {
      surveyID,
      questions: surveyData.questions.map((question, index) => ({
        text: question.text,
        answer: userAnswers[index].answer,
      })),
    };

    // Implement logic to save survey
    const response = await fetch("http://localhost:3080/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveyWithAnswers),
    });

    const data = await response.json();
    console.log("Answers saved:", data);
  };

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h3">{surveyData.title}</Typography>
      {surveyData.questions.map((question, index) => (
        <div key={index}>
          <Typography variant="h5">{question.text}</Typography>
          {question.type === "text" ? (
            <TextField
              label="Your Answer"
              value={userAnswers[index].answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              fullWidth
              margin="normal"
            />
          ) : question.type === "multipleChoice" ? (
            <RadioGroup
              aria-label="quiz"
              name="quiz"
              value={userAnswers[index].answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            >
              <Grid container spacing={2}>
                {question.answers.map((option, optionIndex) => (
                  <Grid item xs={6} key={optionIndex}>
                    <FormControlLabel
                      value={option.text}
                      control={<Radio />}
                      label={option.text}
                    />
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          ) : (
            <Grid container spacing={2}>
              {question.answers.map((option, optionIndex) => (
                <Grid item xs={6} key={optionIndex}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userAnswers[index].answer.includes(
                          option.text
                        )}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const updatedAnswers =
                            userAnswers[index].answer.slice(); // Create a copy
                          if (checked) {
                            updatedAnswers.push(option.text);
                          } else {
                            const index = updatedAnswers.indexOf(option.text);
                            if (index > -1) {
                              updatedAnswers.splice(index, 1);
                            }
                          }
                          handleAnswerChange(index, updatedAnswers);
                        }}
                      />
                    }
                    label={option.text}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      ))}
      <Button variant="contained" onClick={handleSaveAnswers}>
        Save Answers
      </Button>
    </Container>
  );
};
