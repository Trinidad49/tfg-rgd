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

  const formatCSVData = (csvData) => {
    const rows = csvData.split("\n");
    const questions = rows[0]
      .split(",")
      .map((question) => ({ text: question.trim() }));

    console.log(rows[5]);

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

    return answers;
  };

  const handleImport = () => {
    formatCSVData(csvData);
    //onImport(csvData);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".csv" />
      <button onClick={handleImport}>Import CSV</button>
    </div>
  );
};
