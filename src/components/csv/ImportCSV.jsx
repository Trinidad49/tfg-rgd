import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import PublishIcon from "@mui/icons-material/Publish";

export const ImportCSV = ({ onImport }) => {
  const [csvData, setCSVData] = useState(null);
  const [fileName, setFileName] = useState("");

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
      title: `${fileName.slice(0, -4)}_Import`,
      questions: questions.map((q, i) => ({
        text: q.text,
        mandatory: false,
        type: getQuestionType(i, answers, questions).type,
        answers: getQuestionType(i, answers, questions).answers,
      })),
    };

    return { answers: answers, survey: newSurvey };
  };

  const handleImport = async () => {
    const { answers, survey } = formatCSVData(csvData);

    //Post survey and get id
    const response = await fetch("http://localhost:3080/surveys", {
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

      await fetch("http://localhost:3080/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyWithAnswers),
      });
    });
    //onImport(csvData);
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
          htmlFor="fileInput"
          style={{ cursor: "pointer" }}
        >
          <PublishIcon fontSize="large" style={{ transform: "scale(1.8)" }} />
          <Typography variant="body1" style={{ marginTop: "15px" }}>
            Choose File
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Typography variant="h6">
            {fileName === "" ? (
              <>No file currently selected</>
            ) : (
              <>{fileName}</>
            )}
          </Typography>

          <Button
            style={{ maxWidth: 200 }}
            variant="contained"
            onClick={handleImport}
          >
            Import CSV
          </Button>
        </Stack>
      </Stack>
    </div>
  );
};
