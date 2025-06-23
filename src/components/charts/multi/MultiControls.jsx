import React from "react";
import { Button, Stack, TextField } from "@mui/material";

export const MultiControls = ({ title, onTitleChange, onDownload, downloadChart }) => (
    <Stack direction="row" spacing={2} marginBottom={2} marginTop={3}>
        <TextField label="Chart Title" value={title} onChange={onTitleChange} />
        <Button variant="contained" onClick={onDownload}>
            Download Chart as PNG
        </Button>
        <Button variant="contained" onClick={downloadChart}>
            Download Data as CSV
        </Button>
    </Stack>
);
