import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  IconButton,
  Snackbar,
  Paper,
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Question } from "./Question";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const backUrl = process.env.REACT_APP_BACK;

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
      mandatory: false,
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(questions);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    setQuestions(reordered);
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

      if (id !== "") {
        sendData._id = id;
      }

      const response = await fetch(backUrl + "/surveys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });

      const data = await response.json();
      if (id === "") {
        setId(data._id);
        setSnackbarMessage("Survey Created");
      } else {
        setSnackbarMessage("Survey Updated");
      }
      setSnackbarOpen(true);
    } catch (error) { }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper style={{ backgroundColor: "white", margin: 10, padding: 30 }}>
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
      <Divider style={{ marginBottom: 20, marginTop: 10 }} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {questions.map((question, index) => (
                <Draggable
                  key={`question-${index}`}
                  draggableId={`question-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        marginBottom: "12px",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <Question
                        index={index}
                        question={{
                          ...question,
                          dragHandleProps: provided.dragHandleProps,
                        }}
                        onUpdate={handleUpdateQuestion}
                        onRemove={handleRemoveQuestion}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button variant="contained" onClick={handleAddQuestion}>
        Add Question
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Paper>
  );
};
