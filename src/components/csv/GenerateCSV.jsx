import { Button } from "@mui/material";
import React from "react";

export const GenerateCSV = ({ survey, surveyData }) => {
  const questions = survey.questions.map((a) => a.text);
  const answers = [];
  surveyData.map((data, index) =>
    answers.push(
      data.answers.map((a) =>
        Array.isArray(a.text) ? a.answer.join(",") : a.answer
      )
    )
  );
  const formatCSV = (questions, answers) => {
    let csv = questions.join(",") + "\n";

    answers.forEach((answer) => {
      const answerRow = answer.map((value) => `"${value}"`).join(",");
      csv += answerRow + "\n";
    });

    return csv;
  };

  const handleDownloadCSV = () => {
    const csvContent = formatCSV(questions, answers);

    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${survey.title}(answers).csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Button onClick={handleDownloadCSV}>Download CSV</Button>
    </div>
  );
};
