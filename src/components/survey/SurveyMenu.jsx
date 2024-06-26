import React from "react";
import { AppBar, Tabs, Tab, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SurveyForm } from "./SurveyForm";
import { AnswerData } from "./AnswerData";

export const SurveyMenu = ({ survey, handleExitEdit }) => {
  const [selectedTab, setSelectedTab] = React.useState("edit");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab value="edit" label="Edit" />
          <Tab value="answers" label="Answers" />
          <div style={{ flexGrow: 1 }} />
          <Button
            style={{ marginRight: 20 }}
            onClick={handleExitEdit}
            startIcon={<CloseIcon />}
          >
            Exit
          </Button>
        </Tabs>
      </AppBar>
      <div role="tabpanel" hidden={selectedTab !== "edit"}>
        {selectedTab === "edit" && <SurveyForm survey={survey} />}
      </div>
      <div role="tabpanel" hidden={selectedTab !== "answers"}>
        {selectedTab === "answers" && <AnswerData survey={survey} />}
      </div>
    </div>
  );
};
