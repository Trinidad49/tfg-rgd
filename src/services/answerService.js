const backUrl = process.env.REACT_APP_BACK;

export async function fetchSurveyAnswers(surveyId) {
  const response = await fetch(`${backUrl}/answers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      surveyid: surveyId,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch answer data");
  }

  return await response.json();
}