import { Autocomplete, TextField, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import MultiHandlerView from "./MultiHandlerView.jsx";
const backUrl = process.env.REACT_APP_BACK;

export const MultiMenu = () => {
  const [surveys, setSurveys] = useState([]);
  const [survey1, setSurvey1] = useState(null);
  const [survey2, setSurvey2] = useState(null);

  const fetchSurveys = async () => {
    try {
      const userID = localStorage.getItem("userID");
      const response = await fetch(`${backUrl}/surveys`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userid: userID,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch surveys");
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
    <Box>
      <Box
        display="flex"
        gap={2}
        mt={3}
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <Box flex={1} minWidth={250}>
          <Autocomplete
            options={surveys}
            getOptionLabel={(option) => option.title}
            onChange={(_, value) => setSurvey1(value)}
            renderInput={(params) => (
              <TextField {...params} label="Select First Survey" variant="outlined" />
            )}
            fullWidth
          />
        </Box>

        <Box flex={1} minWidth={250}>
          <Autocomplete
            options={surveys}
            getOptionLabel={(option) => option.title}
            onChange={(_, value) => setSurvey2(value)}
            renderInput={(params) => (
              <TextField {...params} label="Select Second Survey" variant="outlined" />
            )}
            fullWidth
          />
        </Box>
      </Box>

      {survey1 && survey2 && (
        <MultiHandlerView
          key={`${survey1._id}-${survey2._id}`}
          surveyA={survey1}
          surveyB={survey2}
        />
      )}
    </Box>
  );
};
