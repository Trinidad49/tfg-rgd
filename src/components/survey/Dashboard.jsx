import React, { useState } from "react";
import { NewSurveyForm } from "./NewSurveyForm";
import { SurveyList } from "./SurveyList";

export const Dashboard = () => {
  const [showNewSurveyForm, setShowNewSurveyForm] = useState(false);
  const [showSurveys, setShowSurveys] = useState(true);
  const handleNewSurvey = () => {
    setShowNewSurveyForm(true);
    setShowSurveys(false);
  };
  const handleSurveys = () => {
    setShowNewSurveyForm(false);
    setShowSurveys(true);
  };
  return (
    <div>
      <h2>Dashboard</h2>
      <div className="tab">
        <button className="tablinks" onClick={handleSurveys}>
          Encuestas
        </button>
        <button className="tablinks" onClick={handleNewSurvey}>
          Crear una encuesta
        </button>
      </div>
      <div className="tabcontent">
        {showNewSurveyForm ? <NewSurveyForm /> : ""}
        {showSurveys ? <SurveyList /> : ""}
      </div>
    </div>
  );
};
