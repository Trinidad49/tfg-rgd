import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Switch,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export const Question = ({ index, question, onUpdate, onRemove }) => {
  const [editedQuestion, setEditedQuestion] = useState(question.text);
  const [editedType, setEditedType] = useState(question.type);
  const [editedAnswers, setEditedAnswers] = useState(question.answers || []);
  const [mandatory, setMandatory] = useState(question.mandatory || false);

  useEffect(() => {
    if (editedType === "multipleChoice" || editedType === "checkbox") {
      setEditedAnswers([""]);
    }
  }, [editedType]);

  const handleAddAnswer = () => {
    setEditedAnswers([...editedAnswers, ""]);
  };

  const handleRemoveAnswer = (answerIndex) => {
    const updatedAnswers = [...editedAnswers];
    updatedAnswers.splice(answerIndex, 1);
    setEditedAnswers(updatedAnswers);
  };

  const handleAnswerChange = (answerIndex, value) => {
    const updatedAnswers = [...editedAnswers];
    updatedAnswers[answerIndex] = value;
    setEditedAnswers(updatedAnswers);
  };

  useEffect(() => {
    onUpdate(index, {
      text: editedQuestion,
      type: editedType,
      answers: editedAnswers,
      mandatory: mandatory,
    });
  }, [editedQuestion, editedType, editedAnswers, mandatory]);

  return (
    <Card variant="outlined" style={{ marginBottom: "16px" }}>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Question {index + 1}</Typography>
          <IconButton onClick={onRemove}>
            <DeleteIcon />
          </IconButton>
        </div>
        <input
          type="text"
          value={editedQuestion}
          onChange={(e) => setEditedQuestion(e.target.value)}
          style={{ marginBottom: "8px" }}
        />
        <select
          value={editedType}
          onChange={(e) => setEditedType(e.target.value)}
          style={{ marginBottom: "8px" }}
        >
          <option value="text">Text</option>
          <option value="multipleChoice">Multiple Choice</option>
          <option value="checkbox">Checkbox</option>
        </select>
        {editedType !== "text" && (
          <div>
            {editedAnswers.map((answer, answerIndex) => (
              <div
                key={answerIndex}
                style={{ display: "flex", marginBottom: "8px" }}
              >
                <input
                  type="text"
                  value={answer}
                  onChange={(e) =>
                    handleAnswerChange(answerIndex, e.target.value)
                  }
                />
                <IconButton onClick={() => handleRemoveAnswer(answerIndex)}>
                  <CloseIcon />
                </IconButton>
              </div>
            ))}
            <IconButton
              onClick={handleAddAnswer}
              style={{ marginBottom: "8px" }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2">Mandatory</Typography>
          <Switch
            checked={mandatory}
            onChange={() => setMandatory(!mandatory)}
            color="primary"
          />
        </div>
      </CardContent>
    </Card>
  );
};
