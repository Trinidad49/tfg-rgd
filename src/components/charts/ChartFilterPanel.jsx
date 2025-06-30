import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Box,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

function ChartFilterPanel({ questions, filters, setFilters }) {
  const [expanded, setExpanded] = useState(false);
  const [newFilterQuestion, setNewFilterQuestion] = useState("");

  const filterableQuestions = questions.filter((q) =>
    ["multipleChoice", "linear"].includes(q.type)
  );

  const addFilter = () => {
    const q = questions.find((q) => q.text === newFilterQuestion);
    if (!q) return;

    const answers = q.answers.map((a) => a.text);
    setFilters((prev) => ({ ...prev, [q.text]: answers }));
    setNewFilterQuestion("");
    setExpanded(true);
  };

  const toggleAnswer = (questionText, answerText) => {
    const current = filters[questionText] || [];
    const newAnswers = current.includes(answerText)
      ? current.filter((a) => a !== answerText)
      : [...current, answerText];

    setFilters({ ...filters, [questionText]: newAnswers });
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Filter Results</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" gap={1} alignItems="center" mb={2}>
          <Box flexGrow={1}>
            <Select
              value={newFilterQuestion}
              onChange={(e) => setNewFilterQuestion(e.target.value)}
              displayEmpty
              size="small"
              fullWidth
            >
              <MenuItem value="" disabled>Select filter question</MenuItem>
              {filterableQuestions
                .filter((q) => !filters[q.text])
                .map((q) => (
                  <MenuItem key={q.text} value={q.text}>
                    {q.text}
                  </MenuItem>
                ))}
            </Select>
          </Box>
          <Button onClick={addFilter} variant="outlined" size="small">
            Add
          </Button>
        </Box>
        {Object.keys(filters).map((questionText) => {
          const question = questions.find((q) => q.text === questionText);
          if (!question) return null;
          return (
            <Box key={questionText} mb={2}>
              <Typography variant="subtitle2">{questionText}</Typography>
              <FormGroup>
                {question.answers.map((a) => (
                  <FormControlLabel
                    key={a.text}
                    control={
                      <Checkbox
                        checked={filters[questionText].includes(a.text)}
                        onChange={() => toggleAnswer(questionText, a.text)}
                      />
                    }
                    label={a.text}
                  />
                ))}
              </FormGroup>
            </Box>
          );
        })}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={clearFilters} variant="text" size="small" color="error">
            Clear Filters
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default ChartFilterPanel;
