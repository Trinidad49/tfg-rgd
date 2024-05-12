import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  IconButton,
  CardContent,
  Card,
  FormControl,
  InputLabel,
  Select,
  Switch,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

export const Question = ({ index, question, onUpdate, onRemove }) => {
  const initialLinearValues =
    question?.type === "linear"
      ? [
          parseInt(question.answers[0].text),
          parseInt(question.answers[question.answers.length - 1].text),
        ]
      : [0, 5];
  const [linearValues, setLinearValues] = useState(initialLinearValues);

  const handleUpdateText = (text) => {
    onUpdate(index, { ...question, text });
  };

  const handleUpdateType = (type) => {
    if (type === "linear") {
      setLinearValues([0, 5]);
      onUpdate(index, { ...question, type, answers: generateRangeArray(0, 5) });
    } else {
      onUpdate(index, { ...question, type });
    }
  };

  const handleUpdateRange = (start, end) => {
    setLinearValues([start, end]);
    onUpdate(index, { ...question, answers: generateRangeArray(start, end) });
  };

  function generateRangeArray(start, end) {
    const numbers = [];
    for (let i = start; i <= end; i++) {
      numbers.push(i.toString());
    }
    return numbers;
  }

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

  const handleUpdateMandatory = () => {
    onUpdate(index, { ...question, mandatory: !question.mandatory });
  };

  return (
    <Card variant="outlined" style={{ marginBottom: "16px" }}>
      <CardContent>
        <Grid container style={{ marginBottom: 15 }}>
          <Grid xs={9}>
            <TextField
              placeholder="Question Text"
              value={question.text}
              onChange={(e) => handleUpdateText(e.target.value)}
              fullWidth
              variant="standard"
              margin="normal"
            />
          </Grid>
          <Grid xs={3}>
            <FormControl
              variant="standard"
              style={{ marginLeft: 50, minWidth: 150 }}
            >
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
              style={{ marginLeft: "10px" }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
        {question.type !== "text" && (
          <>
            {question.type === "linear" ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ margin: "0 8px" }}>From</span>
                <FormControl style={{ marginRight: "8px" }}>
                  <Select
                    value={linearValues[0]}
                    onChange={(e) =>
                      handleUpdateRange(
                        parseInt(e.target.value),
                        linearValues[1]
                      )
                    }
                    style={{ maxWidth: 70 }}
                  >
                    {[0, 1].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <span style={{ margin: "0 8px" }}>to</span>
                <FormControl>
                  <Select
                    value={linearValues[1]}
                    onChange={(e) =>
                      handleUpdateRange(
                        linearValues[0],
                        parseInt(e.target.value)
                      )
                    }
                    style={{ maxWidth: 70 }}
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
                    marginBottom: 2,
                    marginLeft: 20,
                    marginRight: 100,
                  }}
                >
                  <TextField
                    placeholder="Answer"
                    value={answer.text}
                    onChange={(e) =>
                      handleUpdateAnswer(answerIndex, e.target.value)
                    }
                    fullWidth
                    multiline
                    size="Small"
                    variant="standard"
                  />
                  <IconButton
                    style={{ marginLeft: 10, marginRight: 10 }}
                    onClick={() => handleRemoveAnswer(answerIndex)}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ))
            )}
            {question.type !== "linear" && (
              <IconButton
                style={{ marginLeft: 20, marginBottom: -20 }}
                onClick={handleAddAnswer}
              >
                <AddIcon />
              </IconButton>
            )}
          </>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span>Mandatory:</span>
          <Switch
            checked={question.mandatory}
            onChange={() => handleUpdateMandatory()}
            color="primary"
            inputProps={{ "aria-label": "mandatory toggle" }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
