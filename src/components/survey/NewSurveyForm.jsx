import React, { useState } from "react";
import { Question } from "./Question";

export const NewSurveyForm = () => {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [answerType, setAnswerType] = useState("text");

  const handleAddQuestion = () => {
    if (newQuestion.trim() === "") {
      return; // Don't add empty questions
    }

    const question = {
      text: newQuestion,
      type: answerType,
      answers: answerType === "text" ? undefined : [],
    };

    setQuestions([...questions, question]);
    setNewQuestion("");
    setAnswerType("text");
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

  return (
    <div>
      <h3>
        Título -
        <input
          type="text"
          placeholder={"Nueva Encuesta"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </h3>
      <div>
        <label>Añadir pregunta</label>
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
        </select>
        <button onClick={handleAddQuestion}>Add</button>
      </div>
      <div>
        {questions.map((question, index) => (
          <div>
            <br />
            <Question
              key={index}
              index={index}
              question={question}
              onUpdate={handleUpdateQuestion}
              onRemove={() => handleRemoveQuestion(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
