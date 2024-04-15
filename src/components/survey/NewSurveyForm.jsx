import React, { useState } from "react";

export const NewSurveyForm = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answerType, setAnswerType] = useState("text");

  const handleAddQuestion = () => {
    if (newQuestion.trim() === "") {
      return;
    }

    const question = {
      text: newQuestion,
      type: answerType,
    };

    setQuestions([...questions, question]);
    setNewQuestion("");
    setAnswerType("text");
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  return (
    <div>
      <h3>Create a New Survey</h3>
      <div>
        <label>Add Question:</label>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <select
          value={answerType}
          onChange={(e) => setAnswerType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="multipleChoice">Multiple Choice</option>
          <option value="checkbox">Checkbox</option>
          {/* Add more options for different answer types if needed */}
        </select>
        <button onClick={handleAddQuestion}>Add</button>
      </div>
      <div>
        {questions.map((question, index) => (
          <div key={index}>
            <p>{question.text}</p>
            <p>Type: {question.type}</p>
            <button onClick={() => handleRemoveQuestion(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};
