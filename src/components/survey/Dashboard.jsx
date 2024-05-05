import React, { useState } from "react";
import { SurveyForm } from "./SurveyForm";
import { SurveyList } from "./SurveyList";
import {
  Container,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

export const Dashboard = ({ onLogin }) => {
  const [selectedOption, setSelectedOption] = useState("Home");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: 20 }}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Drawer variant="permanent" anchor="left">
            <List>
              {["Surveys", "New Survey"].map((option, index) => (
                <ListItem
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  style={{ cursor: "pointer" }}
                >
                  <ListItemText primary={option} />
                </ListItem>
              ))}
            </List>
            <List style={{ marginTop: "auto" }}>
              <ListItem onClick={onLogin} style={{ cursor: "pointer" }}>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Drawer>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h4" gutterBottom>
            {selectedOption}
          </Typography>
          {selectedOption === "Surveys" && (
            <div>
              <SurveyList />
            </div>
          )}
          {selectedOption === "New Survey" && (
            <div>
              <SurveyForm />
            </div>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
