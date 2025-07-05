import React, { useState } from "react";
import {
    Button,
    Stack,
    TextField,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export const MultiControls = ({
    title,
    onTitleChange,
    onDownload,
    downloadChart,
    onDownloadTable,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleDownloadPNG = () => {
        handleMenuClose();
        onDownload();
    };

    const handleDownloadCSV = () => {
        handleMenuClose();
        downloadChart();
    };

    const handleDownloadTablePNG = () => {
        handleMenuClose();
        onDownloadTable();
    };

    return (
        <Stack
            direction="row"
            spacing={2}
            marginBottom={2}
            marginTop={3}
            justifyContent="center"
            alignItems="center"
        >
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
                size="small"
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
                <MenuItem onClick={handleDownloadTablePNG}>
                    <ListItemIcon>
                        <ImageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Table as PNG</ListItemText>
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
