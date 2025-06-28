import { Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import PublishIcon from "@mui/icons-material/Publish";
const backUrl = process.env.REACT_APP_BACK

export const ImportCSV = () => {
  const [csvData, setCSVData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      setCSVData(contents);
    };

    reader.readAsText(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    setFileName(file.name);
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
    if (diferentAnswers.length < 10 && !isCheckBox) {
      const sortedAnswers = [];
      let isLinear = true;
      for (let i = 0; i < diferentAnswers.length; i++) {
        const num = parseInt(diferentAnswers[i]);
        if (
          !isNaN(num) &&
          num >= 0 &&
          num <= 10 &&
          !sortedAnswers.includes(num)
        ) {
          sortedAnswers.push(num);
        } else {
          isLinear = false;
        }
      }
      if (isLinear) {
        const maxNumber = Math.max(...sortedAnswers);
        const linearArray = [];
        for (let i = 0; i <= maxNumber; i++) {
          linearArray.push(i.toString());
        }
        return { type: "linear", answers: linearArray };
      }
    }
    if (diferentAnswers.length < 6) {
      if (isCheckBox) return { type: "checkbox", answers: diferentAnswers };
      return { type: "multipleChoice", answers: diferentAnswers };
    }
    return { type: "text", answers: [] };
  };

  const formatCSVData = (csvData) => {
  const raw = csvData.charCodeAt(0) === 0xfeff ? csvData.slice(1) : csvData;

  const rows = raw
    .split("\n")
    .map((row) => row.trim())
    .filter((row) => row.length > 0);

  const parseCSVRow = (row, delimiter = ";") => {
    const regex = new RegExp(
      `(?<=^|${delimiter})"((?:[^"]|"")*)"(?=${delimiter}|$)`,
      "g"
    );
    const values = [];
    let match;
    while ((match = regex.exec(row)) !== null) {
      values.push(match[1].replace(/""/g, `"`));
    }
    return values;
  };

  const header = parseCSVRow(rows[0]);
  const questions = header.map((q) => ({ text: q }));

  const answers = rows.slice(1).map((row) => {
    const values = parseCSVRow(row);
    return values.map((value, index) => ({
      text: questions[index]?.text,
      answer: value,
    }));
  });

  // Use one getQuestionType call per question
  const questionDetails = questions.map((q, i) =>
    getQuestionType(i, answers, questions)
  );

  const newSurvey = {
    userID: localStorage.getItem("userID"),
    title: `${fileName.slice(0, -4)}_Import`,
    questions: questions.map((q, i) => ({
      text: q.text,
      mandatory: false,
      type: questionDetails[i].type,
      answers: questionDetails[i].answers,
    })),
  };

  return { answers, survey: newSurvey };
};


  const handleImport = async () => {
    const { answers, survey } = formatCSVData(csvData);

    //Post survey and get id
    const response = await fetch(backUrl+"/surveys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(survey),
    });

    const data = await response.json();

    //Post answers with id
    answers.forEach(async (a) => {
      const surveyWithAnswers = {
        surveyID: data._id,
        questions: a,
      };

      await fetch(backUrl+"/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyWithAnswers),
      });
    });

    setSnackbarOpen(true);
    setCSVData(null);
    setFileName("");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Stack spacing={4} alignItems="center" style={{ marginBottom: 100 }}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv"
          style={{ display: "none" }}
          id="fileInput"
        />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="200px"
          height="200px"
          border="2px dashed #aaa"
          borderRadius="8px"
          style={{
            cursor: "pointer",
            backgroundColor: isDragging ? "#f0f0f0" : "transparent",
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <PublishIcon fontSize="large" style={{ transform: "scale(1.8)" }} />
          <Typography variant="body1" style={{ marginTop: "15px" }}>
            Choose File
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Typography variant="h6">
            {fileName === "" ? "No file currently selected" : fileName}
          </Typography>
          <Button
            style={{ maxWidth: 200 }}
            variant="contained"
            onClick={handleImport}
            disabled={!csvData}
          >
            Import CSV
          </Button>
        </Stack>
      </Stack>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={"Survey Imported!"}
      />
    </div>
  );
};
