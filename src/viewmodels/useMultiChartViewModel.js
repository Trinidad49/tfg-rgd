import { useEffect, useState } from "react";
import { fetchSurveyAnswers } from "../services/answerService";

function useMultiChartViewModel(survey) {
  const [surveyData, setSurveyData] = useState(null);
  const [chartData, setChartData] = useState();
  const [currentTitle, setCurrentTitle] = useState();
  const [optionalData, setOptionalData] = useState();

  useEffect(() => {
    fetchSurveyAnswers(survey._id)
      .then(setSurveyData)
      .catch((err) => console.error(err));
  }, [survey._id]);

  const getAnswerCount = (optionText, questionIndex) =>
    survey.questions[questionIndex].type === "checkbox"
      ? surveyData.filter((a) =>
          a.answers[questionIndex]?.answer.includes(optionText)
        ).length
      : surveyData.filter(
          (a) => a.answers[questionIndex]?.answer === optionText
        ).length;

  const getChartData = (index) => {
    return survey.questions[index].answers.map((a) => ({
      text: a.text,
      count: getAnswerCount(a.text, index),
    }));
  };

  const handleQuestionChange = (question) => {
    const index = survey.questions.findIndex((q) => q.text === question.text);
    if (index !== -1) {
      setCurrentTitle(survey.questions[index].text);
      setChartData(getChartData(index));
      setOptionalData(null);
    }
  };

  const handleOptionalChange = (question) => {
    const index = survey.questions.findIndex((q) => q.text === question.text);
    if (index === -1 || !chartData) return;

    const optionTexts = survey.questions[index].answers.map(a => a.text);

    const auxData = chartData.map(item => ({
      ...item,
      options: Object.fromEntries(optionTexts.map(text => [text, 0])),
    }));

    surveyData.forEach(obj => {
      const answer1 = obj.answers.find(ans => ans.text === currentTitle)?.answer;
      const answer2 = obj.answers.find(ans => ans.text === question.text)?.answer;

      if (answer1 && answer2) {
        const auxItem = auxData.find(item => item.text === answer1);
        if (auxItem && auxItem.options.hasOwnProperty(answer2)) {
          auxItem.options[answer2]++;
        }
      }
    });

    setOptionalData(auxData);
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

export default useMultiChartViewModel;