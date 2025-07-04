import React, { useState } from "react";
import {
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";

export const ChartControls = ({ chartType, onTypeChange, title, onTitleChange, onDownload, downloadChart }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDownloadPNG = () => {
    onDownload();
    handleMenuClose();
  };

  const handleDownloadCSV = () => {
    downloadChart();
    handleMenuClose();
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      marginBottom={2}
      marginTop={3}
      alignItems="center"
      justifyContent="center"
    >
      <Select value={chartType} onChange={onTypeChange} variant="outlined" size="small">
        <MenuItem value="barh">Horizontal Bar</MenuItem>
        <MenuItem value="bar">Bar</MenuItem>
        <MenuItem value="donut">Donut</MenuItem>
        <MenuItem value="stackedBar">Stacked Bar</MenuItem>
        <MenuItem value="groupedBar">Grouped Bar</MenuItem>
        <MenuItem value="groupedBarH">Horizontal Grouped Bar</MenuItem>
      </Select>

      <TextField
        label="Chart Title"
        value={title}
        onChange={onTitleChange}
        variant="outlined"
        size="small"
      />

      <Button
        variant="contained"
        onClick={handleMenuOpen}
        endIcon={<FileDownloadIcon />}
      >
        Download
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleDownloadPNG}>
          <ListItemIcon>
            <ImageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chart as PNG</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownloadCSV}>
          <ListItemIcon>
            <InsertDriveFileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Data as CSV</ListItemText>
        </MenuItem>
      </Menu>
    </Stack>
  );
};
