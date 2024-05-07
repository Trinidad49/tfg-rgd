import React, { useState } from "react";

export const ImportCSV = ({ onImport }) => {
  const [csvData, setCSVData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      setCSVData(contents);
    };

    reader.readAsText(file);
  };

  const getQuestionType = (i, answers, questions) => {
    const diferentAnswers = [];
    let isCheckBox = false;

    answers.forEach((a) => {
      if (a[i]?.text === questions[i].text && a[i]?.answer !== "") {
        if (!diferentAnswers.includes(a[i].answer)) {
          if (a[i].answer.includes(",")) {
            isCheckBox = true;
            const checkboxanswers = a[i].answer.split(",");
            checkboxanswers.forEach((c) => {
              if (!diferentAnswers.includes(c)) {
                diferentAnswers.push(c);
              }
            });
          } else {
            diferentAnswers.push(a[i].answer);
          }
        }
      }
    });
    if (diferentAnswers.length < 6) {
      if (isCheckBox) return { type: "checkBox", answers: diferentAnswers };
      return { type: "multipleChoice", answers: diferentAnswers };
    }
    return { type: "text", answers: [] };
  };

  const formatCSVData = (csvData) => {
    const rows = csvData.split("\n");
    const questions = rows[0]
      .split(",")
      .map((question) => ({ text: question.trim() }));

    const answers = [];
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split('","');
      rowData[0] = rowData[0].substring(1);
      rowData[rowData.length - 1] = rowData[rowData.length - 1].substring(
        0,
        rowData[rowData.length - 1].length - 1
      );
      const userAnswers = rowData.map((answer, index) => ({
        text: questions[index]?.text,
        answer: answer,
      }));
      answers.push(userAnswers);
    }

    const newSurvey = {
      userID: localStorage.getItem("userID"),
      title: "NombreArchivo+Import",
      questions: questions.map((q, i) => ({
        text: q.text,
        type: getQuestionType(i, answers, questions).type,
        answers: getQuestionType(i, answers, questions).answers,
      })),
    };

    return { answers: answers, survey: newSurvey };
  };

  const handleImport = () => {
    const { answers, survey } = formatCSVData(csvData);
    //Post survey and get id

    //Post answers with id
    //onImport(csvData);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".csv" />
      <button onClick={handleImport}>Import CSV</button>
    </div>
  );
};
