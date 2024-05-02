import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import { SurveyForm } from "./SurveyForm";

export const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const fetchSurveys = async () => {
    try {
      const userID = localStorage.getItem("userID");
      const response = await fetch("http://localhost:3080/surveys", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userid: userID,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch surveys");
      }
      const data = await response.json();
      setSurveys(data);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleEditSurvey = (survey) => {
    setSelectedSurvey(survey);
  };

  const handleExitEdit = () => {
    setSelectedSurvey(null);
    fetchSurveys();
  };

  return (
    <div>
      {!selectedSurvey && (
        <Grid container spacing={2}>
          {surveys.map((survey) => (
            <Grid item key={survey._id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {survey.title}
                  </Typography>
                  <Button
                    onClick={() => handleEditSurvey(survey)}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {selectedSurvey && (
        <div>
          <div>
            <Typography>Edit Survey</Typography>
            <Button onClick={handleExitEdit} startIcon={<CloseIcon />}>
              Exit
            </Button>
          </div>
          <SurveyForm survey={selectedSurvey} />
        </div>
      )}
    </div>
  );
};
