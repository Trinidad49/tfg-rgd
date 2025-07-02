// components/surveySummary/useSurveySummaryViewModel.js
import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { fetchSurveyAnswers } from "../services/answerService";

const baseColorPalette = [
  "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f",
  "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ac",
];

export const useSurveySummaryViewModel = (survey) => {
  const [answers, setAnswers] = useState(null);
  const summaryRef = useRef();

  useEffect(() => {
    setAnswers(null);
    fetchSurveyAnswers(survey._id)
      .then(setAnswers)
      .catch((err) => {
        console.error("Error fetching answers:", err);
        setAnswers([]);
      });
  }, [survey._id]);

  const groupAnswersByQuestion = (answers) => {
    const grouped = {};
    for (const response of answers) {
      for (const { text, answer } of response.answers) {
        if (!grouped[text]) grouped[text] = [];
        grouped[text].push(answer);
      }
    }
    return grouped;
  };

  const buildBarChartData = (responses) => {
    const counts = {};
    responses.forEach((r) => {
      counts[r] = (counts[r] || 0) + 1;
    });

    return Object.entries(counts).map(([label, value], i) => ({
      answer: label,
      count: value,
      color: baseColorPalette[i % baseColorPalette.length],
    }));
  };

  const getInsights = (grouped) => ({
    totalResponses: answers.length,
  });

  const handleExportPDF = async () => {
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    const usableWidth = pageWidth - margin * 2;

    const container = summaryRef.current;

    const headerNode = container.children[0];
    const headerCanvas = await html2canvas(headerNode, { scale: 2 });
    const headerImg = headerCanvas.toDataURL("image/png");
    let headerHeight = (headerCanvas.height * usableWidth) / headerCanvas.width;

    pdf.addImage(headerImg, "PNG", margin, margin, usableWidth, headerHeight);
    let currentHeight = margin + headerHeight + 20;

    const questionsContainer = container.children[2];

    for (let i = 0; i < questionsContainer.children.length; i++) {
      const questionNode = questionsContainer.children[i];
      const canvas = await html2canvas(questionNode, { scale: 2 });
      const img = canvas.toDataURL("image/png");
      const imgHeight = (canvas.height * usableWidth) / canvas.width;

      if (currentHeight + imgHeight > pageHeight - margin) {
        pdf.addPage();
        currentHeight = margin;
      }

      pdf.addImage(img, "PNG", margin, currentHeight, usableWidth, imgHeight);
      currentHeight += imgHeight + 20;
    }

    pdf.save(`${survey.title}_summary.pdf`);
  };

  const grouped = answers ? groupAnswersByQuestion(answers) : {};
  const insights = answers ? getInsights(grouped) : {};
  const getChartData = (responses) => buildBarChartData(responses);

  return {
    answers,
    grouped,
    insights,
    summaryRef,
    handleExportPDF,
    getChartData,
  };
};
