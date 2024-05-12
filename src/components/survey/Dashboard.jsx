import React, { useState } from "react";
import { SurveyForm } from "./SurveyForm";
import { SurveyList } from "./SurveyList";
import LogoutIcon from "@mui/icons-material/Logout";
import PollIcon from "@mui/icons-material/Poll";
import AddIcon from "@mui/icons-material/Add";
import {
  Container,
  Divider,
  Drawer,
  Grid,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

export const Dashboard = ({ onLogin }) => {
  const [selectedOption, setSelectedOption] = useState("Surveys");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: 20 }}>
      <Drawer variant="permanent" anchor="left">
        <List>
          {["New Survey", "Surveys"].map((option) => (
            <ListItemButton
              key={option}
              onClick={() => handleOptionClick(option)}
              style={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#b6b6b6" },
              }}
            >
              {option === "Surveys" ? <PollIcon /> : <AddIcon />}
              <ListItemText style={{ marginLeft: 5 }} primary={option} />
            </ListItemButton>
          ))}
        </List>
        <List style={{ marginTop: "auto", padding: "5" }}>
          <Divider variant="middle" />
          <ListItemButton
            onClick={onLogin}
            style={{
              cursor: "pointer",
              "&:hover": { backgroundColor: "#b6b6b6" },
            }}
          >
            <LogoutIcon />
            <ListItemText style={{ marginLeft: 5 }} primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>
      <Grid container>
        <Grid item xs={13}>
          {selectedOption === "Surveys" && <SurveyList />}
          {selectedOption === "New Survey" && <SurveyForm />}
        </Grid>
      </Grid>
    </Container>
  );
};
