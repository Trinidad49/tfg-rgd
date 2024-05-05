import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import { SurveyMenu } from "./SurveyMenu";

export const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

  return (
    <div>
      {!selectedSurvey && (
        <div>
          <Grid container spacing={2}>
            {surveys.map((survey) => (
              <Grid item key={survey._id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {survey.title}
                    </Typography>
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
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
