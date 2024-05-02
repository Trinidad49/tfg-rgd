import React, { useState } from "react";
import { Question } from "./Question";

export const NewSurveyForm = () => {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");

  const handleAddQuestion = () => {
    const newQuestion = {
      text: "",
      type: "text",
      answers: undefined,
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
          answers: question.answers,
          mandatory: question.mandatory,
        })),
      };

      //Send the id if present
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
      //Retrieve an ID if not present
      if (id === "") {
        setId(data._id);
      }
      console.log(data);
    } catch (error) {}
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
        <button onClick={handleSaveSurvey}>Save</button>
      </h3>
      <div>
        {questions.map((question, index) => (
          <div key={index}>
            <Question
              index={index}
              question={question}
              onUpdate={handleUpdateQuestion}
              onRemove={() => handleRemoveQuestion(index)}
            />
          </div>
        ))}
        <button onClick={handleAddQuestion}>Add</button>
      </div>
    </div>
  );
};
