import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function ChartFilterPanel({ filterOptions, selectedAnswers, setSelectedAnswers }) {
  const toggleAnswer = (answer) => {
    if (selectedAnswers.includes(answer)) {
      setSelectedAnswers(selectedAnswers.filter((a) => a !== answer));
    } else {
      setSelectedAnswers([...selectedAnswers, answer]);
    }
  };

  const handleReset = () => {
    setSelectedAnswers([...filterOptions]);
  };

  const handleSelectNone = () => {
    setSelectedAnswers([]);
  };

  return (
    <Accordion sx={{ width: "100%", mb: 2 }} defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Filter Answers</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {filterOptions.map((answer) => (
            <FormControlLabel
              key={answer}
              control={
                <Checkbox
                  checked={selectedAnswers.includes(answer)}
                  onChange={() => toggleAnswer(answer)}
                />
              }
              label={answer}
            />
          ))}
        </FormGroup>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="outlined" size="small" onClick={handleReset}>
            Select All
          </Button>
          <Button variant="text" size="small" onClick={handleSelectNone}>
            Clear
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default ChartFilterPanel;
