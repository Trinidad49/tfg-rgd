import { Button } from "@mui/material";
import React from "react";

export const GenerateCSV = ({ survey, surveyData }) => {
  const questions = survey.questions.map((q) => q.text);

  const answers = surveyData.map((data) =>
    data.answers.map((a) =>
      Array.isArray(a.text)
        ? a.answer.join(", ")
        : a.answer
    )
  );

  const escapeCSV = (value) => {
    if (value == null) return "";
    const str = value.toString();
    return `"${str.replace(/"/g, '""')}"`;
  };

  const formatCSV = (questions, answers) => {
    const delimiter = ";";
    const BOM = "\uFEFF";

    const header = questions.map(escapeCSV).join(delimiter);
    const rows = answers.map((row) => row.map(escapeCSV).join(delimiter));

    return BOM + [header, ...rows].join("\n");
  };

  const handleDownloadCSV = () => {
    const csvContent = formatCSV(questions, answers);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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
    <Button variant="contained" onClick={handleDownloadCSV}>
      Download CSV
    </Button>
  );
};
