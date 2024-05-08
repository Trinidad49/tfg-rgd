import React from "react";
import {
  TextField,
  MenuItem,
  IconButton,
  CardContent,
  Card,
  FormControl,
  InputLabel,
  Select,
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

  const handleUpdateRange = (start, end) => {
    onUpdate(index, { ...question, range: [start, end] });
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
          <FormControl style={{ marginLeft: "8px" }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={question.type}
              onChange={(e) => handleUpdateType(e.target.value)}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
              <MenuItem value="checkbox">Checkbox</MenuItem>
              <MenuItem value="linear">Linear Scale</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            onClick={() => onRemove(index)}
            style={{ marginLeft: "8px" }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
        {question.type !== "text" && (
          <div>
            {question.type === "linear" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span style={{ margin: "0 8px" }}>From</span>
                <FormControl fullWidth>
                  <Select
                    value={question.range ? question.range[0] : 0}
                    onChange={(e) =>
                      handleUpdateRange(
                        parseInt(e.target.value),
                        question.range ? question.range[1] : 10
                      )
                    }
                  >
                    {[0, 1].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <span style={{ margin: "0 8px" }}>to</span>
                <FormControl fullWidth>
                  <Select
                    value={question.range ? question.range[1] : 5}
                    onChange={(e) =>
                      handleUpdateRange(
                        question.range ? question.range[0] : 0,
                        parseInt(e.target.value)
                      )
                    }
                  >
                    {[...Array(9).keys()].map((value) => (
                      <MenuItem key={value + 2} value={value + 2}>
                        {value + 2}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            ) : (
              question.answers.map((answer, answerIndex) => (
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
              ))
            )}
            {question.type !== "linear" && (
              <IconButton onClick={handleAddAnswer}>
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
