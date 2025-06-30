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
  useMediaQuery,
  useTheme,
} from "@mui/material";

const backUrl = process.env.REACT_APP_BACK;

export const AnswerSurvey = ({ surveyID }) => {
  const [surveyData, setSurveyData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [answerCheck, setAnswerCheck] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(`${backUrl}/survey`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            surveyid: surveyID,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch surveys");
        const data = await response.json();
        if (data.length > 0) {
          setSurveyData(data[0]);
          setUserAnswers(
            data[0].questions.map((q) => ({
              answer: q.type === "checkbox" ? [] : "",
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

  const handleAnswerChange = (index, answer) => {
    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[index] = { answer };
      return updated;
    });
  };

  const handleSaveAnswers = async () => {
    const surveyWithAnswers = {
      surveyID,
      questions: surveyData.questions.map((q, i) => ({
        text: q.text,
        answer: userAnswers[i].answer,
      })),
    };

    const updatedCheck = userAnswers.map((a, i) => {
      const isMandatory = surveyData.questions[i].mandatory;
      const isEmpty =
        a.answer.length === 0 ||
        (Array.isArray(a.answer) && a.answer.length === 0);
      return isMandatory && isEmpty;
    });

    setAnswerCheck(updatedCheck);

    if (!updatedCheck.includes(true)) {
      const res = await fetch(`${backUrl}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(surveyWithAnswers),
      });
      if (res.ok) setIsSubmitted(true);
      else console.error("Failed to save survey answers");
    }
  };

  if (!surveyData) return <div>Loading...</div>;

  if (isSubmitted) {
    return (
      <Container maxWidth="sm">
        <Paper sx={{ backgroundColor: "white", m: 1, p: isMobile ? 2 : 4 }}>
          <Typography variant={isMobile ? "h5" : "h4"} align="center" gutterBottom>
            Survey Submitted
          </Typography>
          <Typography variant="body1" align="center">
            Thank you for completing the survey!
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ backgroundColor: "white", m: 1, p: isMobile ? 2 : 4 }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
          {surveyData.title}
        </Typography>
        <Divider sx={{ my: 2 }} />

        {surveyData.questions.map((question, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6">
                    {index + 1}. {question.text}
                    {question.mandatory && <span style={{ color: "red" }}> *</span>}
                  </Typography>
                  {answerCheck[index] && (
                    <Typography variant="caption" color="error">
                      You must answer this question
                    </Typography>
                  )}
                </Box>
                {question.type === "text" && (
                  <TextField
                    placeholder="Your answer"
                    value={userAnswers[index].answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    fullWidth
                    multiline
                    variant="outlined"
                  />
                )}
                {question.type === "multipleChoice" && (
                  <RadioGroup
                    value={userAnswers[index].answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  >
                    <Grid container spacing={1}>
                      {question.answers.map((option, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                          <FormControlLabel
                            value={option.text}
                            control={<Radio />}
                            label={option.text}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>
                )}
                {question.type === "linear" && (
                  <Box>
                    <RadioGroup
                      row
                      value={userAnswers[index].answer}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                    >
                      <Grid container justifyContent="center" spacing={2}>
                        {question.answers.map((option, i) => (
                          <Grid item key={i}>
                            <Stack spacing={0.5} alignItems="center">
                              <Typography variant="caption">{option.text}</Typography>
                              <Radio value={option.text} size="small" />
                            </Stack>
                          </Grid>
                        ))}
                      </Grid>
                    </RadioGroup>
                  </Box>
                )}
                {question.type === "checkbox" && (
                  <Grid container spacing={1}>
                    {question.answers.map((option, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={userAnswers[index].answer.includes(option.text)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const updated = [...userAnswers[index].answer];
                                if (checked) updated.push(option.text);
                                else {
                                  const idx = updated.indexOf(option.text);
                                  if (idx > -1) updated.splice(idx, 1);
                                }
                                handleAnswerChange(index, updated);
                              }}
                            />
                          }
                          label={option.text}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAnswers}
            size={isMobile ? "small" : "medium"}
          >
            Submit Survey
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
