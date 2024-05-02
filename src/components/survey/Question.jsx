import React from "react";
import {
  TextField,
  MenuItem,
  IconButton,
  CardContent,
  Card,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

export const Question = ({ index, question, onUpdate, onRemove }) => {
  const handleUpdateText = (text) => {
    onUpdate(index, { ...question, text });
  };

  const handleUpdateType = (type) => {
    onUpdate(index, { ...question, type });
  };

  const handleAddAnswer = () => {
    onUpdate(index, {
      ...question,
      answers: [...question.answers, ""],
    });
  };

  const handleRemoveAnswer = (answerIndex) => {
    const updatedAnswers = question.answers.filter(
      (_, index) => index !== answerIndex
    );
    onUpdate(index, {
      ...question,
      answers: updatedAnswers,
    });
  };

  const handleUpdateAnswer = (answerIndex, value) => {
    const updatedAnswers = [...question.answers];
    updatedAnswers[answerIndex] = value;
    onUpdate(index, {
      ...question,
      answers: updatedAnswers,
    });
  };

  return (
    <Card variant="outlined" style={{ marginBottom: "16px" }}>
      <CardContent>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <TextField
            label="Question Text"
            value={question.text}
            onChange={(e) => handleUpdateText(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            value={question.type}
            onChange={(e) => handleUpdateType(e.target.value)}
            margin="normal"
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
            <MenuItem value="checkbox">Checkbox</MenuItem>
          </TextField>
          <IconButton
            onClick={() => onRemove(index)}
            style={{ marginLeft: "8px" }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
        {question.type !== "text" && (
          <div>
            {question.answers.map((answer, answerIndex) => (
              <div
                key={answerIndex}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <TextField
                  label="Answer"
                  value={answer.text}
                  onChange={(e) =>
                    handleUpdateAnswer(answerIndex, e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <IconButton onClick={() => handleRemoveAnswer(answerIndex)}>
                  <CloseIcon />
                </IconButton>
              </div>
            ))}
            <IconButton onClick={handleAddAnswer}>
              <AddCircleOutlineIcon />
            </IconButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
