import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { fetchSurveyAnswers } from "../services/answerService";

const baseColorPalette = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ac",
];

export const useSurveySummaryViewModel = (survey) => {
  const [answers, setAnswers] = useState(null);
  const summaryRef = useRef();

  useEffect(() => {
    setAnswers(null);
    fetchSurveyAnswers(survey._id)
      .then((data) => {
        setAnswers(data);
      })
      .catch((err) => {
        console.error("Error fetching answers:", err);
        setAnswers([]);
      });
  }, [survey._id]);

  // Group answers by question text
  const groupAnswersByQuestion = (answers) => {
    const grouped = {};
    for (const response of answers) {
      for (const { text, answer } of response.answers) {
        if (!grouped[text]) grouped[text] = [];
        if (Array.isArray(answer)) {
          grouped[text].push(...answer);
        } else {
          grouped[text].push(answer);
        }
      }
    }
    return grouped;
  };

  // Helper to build consistent chart data format: { text, count, color }
  const buildChartData = (responses) => {
    const counts = {};
    responses.forEach((r) => {
      counts[r] = (counts[r] || 0) + 1;
    });

    const data = Object.entries(counts).map(([label, value], i) => ({
      text: label,
      count: value,
      color: baseColorPalette[i % baseColorPalette.length],
    }));

    return data;
  };

  const getChartData = (responses, type) => {
    switch (type) {
      case "multipleChoice":
        // Pie chart expects { id, label, value, color } in QuestionChart, so map on the fly there
        return buildChartData(responses);
      case "checkbox":
      case "linear":
        return buildChartData(responses);
      default:
        return [];
    }
  };

  const getInsights = (grouped) => ({
    totalResponses: answers ? answers.length : 0,
  });

  // PDF export logic unchanged, just kept here for completeness
  const handleExportPDF = async () => {
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    const usableWidth = pageWidth - margin * 2;

    const container = summaryRef.current;
    if (!container) {
      console.warn("No summaryRef container found for PDF export.");
      return;
    }
    
    const headerNode = container.children[0];
    const headerCanvas = await html2canvas(headerNode, { scale: 2 });
    const headerImg = headerCanvas.toDataURL("image/png");
    const headerHeight = (headerCanvas.height * usableWidth) / headerCanvas.width;

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
  const insights = getInsights(grouped);

  return {
    answers,
    grouped,
    insights,
    summaryRef,
    handleExportPDF,
    getChartData,
  };
};
