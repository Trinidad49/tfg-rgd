import React from "react";
import { Typography, Box } from "@mui/material";

const MultiHandlerView = ({ surveyA, surveyB }) => {
  return (
    <Box mt={4}>
      <Typography variant="h6">Comparing Surveys:</Typography>
      <Typography>🟢 {surveyA.title}</Typography>
      <Typography>🔵 {surveyB.title}</Typography>

      {/* Insert your multi-survey analysis logic or charts here */}
    </Box>
  );
};

export default MultiHandlerView;
