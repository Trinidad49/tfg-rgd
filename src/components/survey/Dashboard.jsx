import React, { useState } from "react";
import { SurveyForm } from "./SurveyForm";
import { SurveyList } from "./SurveyList";
import LogoutIcon from "@mui/icons-material/Logout";
import PollIcon from "@mui/icons-material/Poll";
import AddIcon from "@mui/icons-material/Add";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import {
  Container,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { ImportCSV } from "../csv/ImportCSV";
import { AnalisisMenu } from "./AnalisisMenu";

const drawerWidth = 240;

export const Dashboard = ({ onLogin }) => {
  const [selectedOption, setSelectedOption] = useState("Surveys");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          {["New Survey", "Surveys", "Analisis", "Import"].map((option) => (
            <ListItemButton
              key={option}
              onClick={() => handleOptionClick(option)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#b6b6b6" },
              }}
            >
              {option === "Surveys" ? (
                <PollIcon />
              ) : option === "Import" ? (
                <ImportExportIcon />
              ) : option === "Analisis" ? (
                <QueryStatsIcon />
              ) : (
                <AddIcon />
              )}
              <ListItemText sx={{ marginLeft: 1 }} primary={option} />
            </ListItemButton>
          ))}
        </List>
        <List sx={{ marginTop: "auto", padding: 1 }}>
          <Divider variant="middle" />
          <ListItemButton
            onClick={onLogin}
            sx={{
              cursor: "pointer",
              "&:hover": { backgroundColor: "#b6b6b6" },
            }}
          >
            <LogoutIcon />
            <ListItemText sx={{ marginLeft: 1 }} primary="Log out" />
          </ListItemButton>
        </List>
      </Drawer>

      {selectedOption === "Analisis" ? (
        <main
          style={{
            marginLeft: drawerWidth,
            padding: 20,
            width: `calc(100% - ${drawerWidth}px)`,
            minHeight: "100vh",
            boxSizing: "border-box",
          }}
        >
          <AnalisisMenu />
        </main>
      ) : (
        <div
          style={{
            marginLeft: drawerWidth,
            display: "flex",
            justifyContent: "center",
            paddingTop: 20,
            boxSizing: "border-box",
          }}
        >
          <Container maxWidth="lg">
            {selectedOption === "Surveys" && <SurveyList />}
            {selectedOption === "New Survey" && <SurveyForm />}
            {selectedOption === "Import" && <ImportCSV />}
          </Container>
        </div>
      )}
    </>
  );
};
