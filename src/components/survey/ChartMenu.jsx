import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ChartHandler } from "./ChartHandler";

export const ChartMenu = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState("");

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

  const handleSurveyChange = (event, value) => {
    if (value) {
      setSelectedSurvey(value._id);
    } else {
      setSelectedSurvey(null);
    }
  };

  return (
    <>
      <Autocomplete
        options={surveys}
        getOptionLabel={(option) => option.title}
        onChange={handleSurveyChange}
        renderInput={(params) => (
          <TextField {...params} label="Select Survey" variant="outlined" />
        )}
        style={{ width: "100%", marginTop: "20px" }}
      />
      {selectedSurvey && (
        <ChartHandler survey={surveys.find((e) => e._id === selectedSurvey)} />
      )}
    </>
  );
};
