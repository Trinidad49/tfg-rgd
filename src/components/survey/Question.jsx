import React, { useState } from "react";

export const Question = ({ index, question, onUpdate, onRemove }) => {
  const [editedQuestion, setEditedQuestion] = useState(question.text);
  const [editedType, setEditedType] = useState(question.type);
  const [editedAnswers, setEditedAnswers] = useState(question.answers || []);

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

  return (
    <div>
      <input
        type="text"
        value={editedQuestion}
        onChange={(e) => setEditedQuestion(e.target.value)}
      />
      <select
        value={editedType}
        onChange={(e) => setEditedType(e.target.value)}
      >
        <option value="text">Text</option>
        <option value="multipleChoice">Multiple Choice</option>
        <option value="checkbox">Checkbox</option>
      </select>
      <button onClick={onRemove}>X</button>
      {editedType !== "text" && (
        <div>
          {editedAnswers.map((answer, answerIndex) => (
            <div key={answerIndex}>
              <input
                type={"text"}
                value={answer}
                onChange={(e) =>
                  handleAnswerChange(answerIndex, e.target.value)
                }
              />
              <button onClick={() => handleRemoveAnswer(answerIndex)}>X</button>
            </div>
          ))}
          <button onClick={handleAddAnswer}>+</button>
        </div>
      )}
    </div>
  );
};
