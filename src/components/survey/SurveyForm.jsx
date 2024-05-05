import React, { useState, useEffect } from "react";
import { TextField, Button, IconButton, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Question } from "./Question";

export const SurveyForm = ({ survey }) => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [id, setId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (survey) {
      setTitle(survey.title);
      setQuestions(survey.questions);
      setId(survey._id);
    }
  }, [survey]);

  const handleAddQuestion = () => {
    const newQuestion = {
      text: "",
      type: "text",
      answers: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (index, updatedQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleSaveSurvey = async () => {
    try {
      const userID = localStorage.getItem("userID");
      const sendData = {
        userID: userID,
        title: title,
        questions: questions.map((question) => ({
          text: question.text,
          type: question.type,
          answers: question.answers.map((answer) =>
            answer.text ? answer.text : answer
          ),
          mandatory: question.mandatory,
        })),
      };

      //Update data when id is present
      if (id !== "") {
        sendData._id = id;
      }
      const response = await fetch("http://localhost:3080/surveys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });

      const data = await response.json();
      //Retrieve an ID from new survey
      if (id === "") {
        setId(data._id);
        setSnackbarMessage("Survey Created");
      } else {
        setSnackbarMessage("Survey Updated");
      }
      setSnackbarOpen(true);
    } catch (error) {}
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          label="Survey Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <IconButton
          color="primary"
          onClick={handleSaveSurvey}
          style={{ marginLeft: "15px", marginRight: "15px" }}
        >
          <SaveIcon />
        </IconButton>
      </div>
      {questions.map((question, index) => (
        <Question
          key={index}
          index={index}
          question={question}
          onUpdate={handleUpdateQuestion}
          onRemove={handleRemoveQuestion}
        />
      ))}
      <Button variant="contained" onClick={handleAddQuestion}>
        Add Question
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
};

//TODO
//Add snackbar when saving and updating
