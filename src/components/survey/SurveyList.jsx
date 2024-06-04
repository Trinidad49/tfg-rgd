import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
  TableContainer,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import { SurveyMenu } from "./SurveyMenu";
import { format } from "date-fns";

export const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");
  const [filter, setFilter] = useState("");

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

  const handleEditSurvey = (survey) => {
    setSelectedSurvey(survey);
    console.log(survey);
  };

  const handleExitEdit = () => {
    setSelectedSurvey(null);
    fetchSurveys();
  };

  const handleShareSurvey = (id) => {
    const surveyLink = `${window.location.origin}/answer?survey=${id}`;
    navigator.clipboard
      .writeText(surveyLink)
      .then(() => {
        setSnackbarMessage("Survey link copied to clipboard");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Failed to copy survey link to clipboard:", error);
      });
  };

  const handleDeleteSurvey = () => {
    // Delete the survey
    fetch("http://localhost:3080/surveys", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: surveyToDelete._id }),
    })
      .then((response) => {
        if (response.ok) {
          fetchSurveys();
        } else {
          console.error("Failed to delete survey");
        }
      })
      .catch((error) => {
        console.error("Error deleting survey:", error);
      })
      .finally(() => {
        setDeleteDialogOpen(false);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredSurveys = surveys.filter((survey) =>
    survey.title.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedSurveys = filteredSurveys.sort((a, b) => {
    if (orderBy === "createdAt") {
      const dateA = new Date(a[orderBy]);
      const dateB = new Date(b[orderBy]);
      if (order === "asc") {
        return dateA - dateB;
      }
      return dateB - dateA;
    } else {
      if (order === "asc") {
        return a[orderBy].localeCompare(b[orderBy]);
      }
      return b[orderBy].localeCompare(a[orderBy]);
    }
  });

  return (
    <div>
      {!selectedSurvey && (
        <div style={{ marginTop: "20px" }}>
          <TableContainer>
            <TextField
              label="Filter by Title"
              value={filter}
              onChange={handleFilterChange}
              style={{ marginBottom: 20, marginTop: 20 }}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sortDirection={orderBy === "title" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "title"}
                      direction={orderBy === "title" ? order : "asc"}
                      onClick={() => handleRequestSort("title")}
                    >
                      Title
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === "createdAt" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "createdAt"}
                      direction={orderBy === "createdAt" ? order : "asc"}
                      onClick={() => handleRequestSort("createdAt")}
                    >
                      Date Created
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedSurveys.map((survey) => (
                  <TableRow key={survey._id}>
                    <TableCell>
                      <Typography variant="h6">{survey.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(survey.createdAt), "yyyy-MM-dd HH:mm")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <Button
                          onClick={() => handleEditSurvey(survey)}
                          startIcon={<EditIcon />}
                        />
                      </Tooltip>
                      <Tooltip title="Copy survey link to clipboard">
                        <Button
                          onClick={() => handleShareSurvey(survey._id)}
                          startIcon={<ShareIcon />}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Button
                          onClick={() => {
                            setSurveyToDelete(survey);
                            setDeleteDialogOpen(true);
                          }}
                          startIcon={<DeleteIcon />}
                          style={{ color: "red" }}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Are you sure you want to delete this survey?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteSurvey}>Delete</Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
          />
        </div>
      )}
      {selectedSurvey && (
        <div>
          <SurveyMenu survey={selectedSurvey} handleExitEdit={handleExitEdit} />
        </div>
      )}
    </div>
  );
};
