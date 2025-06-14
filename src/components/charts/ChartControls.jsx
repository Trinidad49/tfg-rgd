import React from "react";
import { Button, MenuItem, Select, Stack, TextField } from "@mui/material";

export const ChartControls = ({ chartType, onTypeChange, title, onTitleChange, onDownload, downloadChart }) => (
  <Stack direction="row" spacing={2} marginBottom={2} marginTop={3}>
    <Select value={chartType} onChange={onTypeChange} variant="outlined">
      <MenuItem value="barh">Horizontal Bar</MenuItem>
      <MenuItem value="bar">Bar</MenuItem>
      <MenuItem value="donut">Donut</MenuItem>
      <MenuItem value="stackedBar">Stacked Bar</MenuItem>
    </Select>
    <TextField label="Chart Title" value={title} onChange={onTitleChange} />
    <Button variant="contained" onClick={onDownload}>
      Download Chart as PNG
    </Button>
    <Button variant="contained" onClick={downloadChart}>
      Download Data as CSV
    </Button>
  </Stack>
);
