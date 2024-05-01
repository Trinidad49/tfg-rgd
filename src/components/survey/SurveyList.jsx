import { Card, CardContent, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

export const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);

  const fetchSurveys = async () => {
    console.log("Dame las encuestas");
    try {
      const userID = localStorage.getItem("userID");
      const response = await fetch("http://localhost:3080/surveys", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userid: userID,
        },
      }); // Assuming the backend endpoint is '/api/surveys'
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

  return (
    <div>
      <h2>My Surveys</h2>
      <Grid container spacing={2}>
        {surveys.map((survey) => (
          <Grid item key={survey._id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {survey.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
