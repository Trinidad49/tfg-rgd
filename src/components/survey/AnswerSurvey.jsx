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
  Paper,
  Divider,
  CardContent,
  Card,
  Stack,
  Box,
} from "@mui/material";

export const AnswerSurvey = ({ surveyID }) => {
  const [surveyData, setSurveyData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [answerCheck, setAnswerCheck] = useState([]);

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
          setUserAnswers(
            data[0].questions.map((question) => ({
              answer: question.type === "checkbox" ? [] : "",
            }))
          );
          setAnswerCheck(
            Array.from({ length: data[0].questions.length }, () => false)
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
    // Combine survey ID with user answers
    const surveyWithAnswers = {
      surveyID,
      questions: surveyData.questions.map((question, index) => ({
        text: question.text,
        answer: userAnswers[index].answer,
      })),
    };

    //Check if mandatory questions have been answered
    const updatedAnswerCheck = userAnswers.map((userAnswer, index) => {
      const isMandatory = surveyData.questions[index].mandatory;
      const isEmpty =
        userAnswer.answer.length === 0 ||
        (Array.isArray(userAnswer.answer) && userAnswer.answer.length === 0);
      return isMandatory && isEmpty;
    });
    setAnswerCheck(updatedAnswerCheck);

    if (!updatedAnswerCheck.includes(true)) {
      // Save survey answer
      const response = await fetch("http://localhost:3080/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyWithAnswers),
      });

      await response.json();
    }
    //TODO: Once survey is saved, redirect to survey completed page
  };

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Paper style={{ backgroundColor: "white", margin: 10, padding: 30 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h3">{surveyData.title}</Typography>
        </div>
        <Divider style={{ marginBottom: 20, marginTop: 10 }} />
        {surveyData.questions.map((question, index) => (
          <Card variant="outlined" style={{ marginBottom: "16px" }}>
            <CardContent key={index}>
              <Typography variant="h5" style={{ marginBottom: 10 }}>
                {question.text}
                {question.mandatory && <span style={{ color: "red" }}> *</span>}
                {answerCheck[index] && (
                  <span style={{ color: "red", fontSize: 17 }}>
                    {" "}
                    You must answer this question
                  </span>
                )}
              </Typography>
              {question.type === "text" ? (
                <TextField
                  placeholder="Answer"
                  value={userAnswers[index].answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  fullWidth
                  multiline
                  variant="standard"
                  margin="normal"
                />
              ) : question.type === "multipleChoice" ? (
                <RadioGroup
                  aria-label="quiz"
                  name="quiz"
                  value={userAnswers[index].answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                >
                  <Grid container>
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
              ) : question.type === "linear" ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  style={{ marginLeft: 100 }}
                >
                  <RadioGroup
                    aria-label="quiz"
                    name="quiz"
                    value={userAnswers[index].answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  >
                    <Grid container spacing={3}>
                      {question.answers.map((option, optionIndex) => (
                        <Grid item xs={1} key={optionIndex}>
                          <Stack alignContent="center">
                            <Typography style={{ marginLeft: 5 }}>
                              {option.text}
                            </Typography>
                            <FormControlLabel
                              value={option.text}
                              control={<Radio />}
                            />
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>
                </Box>
              ) : (
                <Grid container>
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
                                const index = updatedAnswers.indexOf(
                                  option.text
                                );
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
            </CardContent>
          </Card>
        ))}
        <Button variant="contained" onClick={handleSaveAnswers}>
          Save Answers
        </Button>
      </Paper>
    </Container>
  );
};
