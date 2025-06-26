import { useEffect, useState, useCallback } from "react";
import { fetchSurveyAnswers } from "../services/answerService";

function useChartViewModel(survey, activeFilters) {
  const [surveyData, setSurveyData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [optionalData, setOptionalData] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedOptionalQuestion, setSelectedOptionalQuestion] = useState(null);

  useEffect(() => {
    fetchSurveyAnswers(survey._id)
      .then(setSurveyData)
      .catch((err) => console.error(err));
  }, [survey._id]);

  const applyFilters = useCallback(
    (answers) => {
      if (!answers) return [];
      if (!activeFilters || Object.keys(activeFilters).length === 0) return answers;

      return answers.filter((response) =>
        Object.entries(activeFilters).every(([questionText, allowedAnswers]) => {
          if (!allowedAnswers || allowedAnswers.length === 0) return true;
          const answerObj = response.answers.find((a) => a.text === questionText);
          return answerObj && allowedAnswers.includes(answerObj.answer);
        })
      );
    },
    [activeFilters]
  );

  const getAnswerCount = useCallback(
    (optionText, questionIndex, filteredAnswers) => {
      if (!filteredAnswers) return 0;
      return survey.questions[questionIndex].type === "checkbox"
        ? filteredAnswers.filter((a) =>
            a.answers[questionIndex]?.answer.includes(optionText)
          ).length
        : filteredAnswers.filter(
            (a) => a.answers[questionIndex]?.answer === optionText
          ).length;
    },
    [survey.questions]
  );

  const getChartData = useCallback(
    (index, filteredAnswers) => {
      if (index === -1 || !filteredAnswers) return [];
      return survey.questions[index].answers.map((a) => ({
        text: a.text,
        count: getAnswerCount(a.text, index, filteredAnswers),
      }));
    },
    [survey.questions, getAnswerCount]
  );

  useEffect(() => {
    if (!surveyData || !selectedQuestion) return;

    const filteredResponses = applyFilters(surveyData);

    const questionIndex = survey.questions.findIndex(
      (q) => q.text === selectedQuestion.text
    );
    if (questionIndex === -1) return;

    setCurrentTitle(selectedQuestion.text);
    setChartData(getChartData(questionIndex, filteredResponses));

    setOptionalData(null);
    setSelectedOptionalQuestion(null);
  }, [surveyData, selectedQuestion, applyFilters, getChartData, survey.questions]);

  useEffect(() => {
    if (
      !surveyData ||
      !selectedOptionalQuestion ||
      !chartData ||
      !selectedQuestion
    )
      return;

    const filteredResponses = applyFilters(surveyData);

    const optionalIndex = survey.questions.findIndex(
      (q) => q.text === selectedOptionalQuestion.text
    );
    if (optionalIndex === -1) {
      setOptionalData(null);
      return;
    }

    const optionTexts = survey.questions[optionalIndex].answers.map((a) => a.text);

    const auxData = chartData.map((item) => ({
      ...item,
      options: Object.fromEntries(optionTexts.map((text) => [text, 0])),
    }));

    filteredResponses.forEach((obj) => {
      const answer1 = obj.answers.find(
        (ans) => ans.text === selectedQuestion.text
      )?.answer;
      const answer2 = obj.answers.find(
        (ans) => ans.text === selectedOptionalQuestion.text
      )?.answer;

      if (answer1 && answer2) {
        const auxItem = auxData.find((item) => item.text === answer1);
        if (auxItem && auxItem.options.hasOwnProperty(answer2)) {
          auxItem.options[answer2]++;
        }
      }
    });

    setOptionalData(auxData);
  }, [
    selectedOptionalQuestion,
    chartData,
    surveyData,
    applyFilters,
    selectedQuestion,
    survey.questions,
  ]);

  const handleQuestionChange = (question) => {
    setSelectedQuestion(question);
  };

  const handleOptionalChange = (question) => {
    setSelectedOptionalQuestion(question);
  };

  return {
    loading: !surveyData,
    chartData,
    currentTitle,
    optionalData,
    questions: survey.questions,
    handleQuestionChange,
    handleOptionalChange,
  };
}

export default useChartViewModel;
