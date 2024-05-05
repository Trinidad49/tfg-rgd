import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import { LoginForm } from "./components/login/LoginForm";
import { RegisterForm } from "./components/login/RegisterForm";
import { Dashboard } from "./components/survey/Dashboard";
import { AnswerSurvey } from "./components/survey/AnswerSurvey";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <Router>
      <Routes>
        <Route path="/answer" element={<AnswerSurveyPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<Dashboard />} />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Dashboard onLogin={handleLogin} />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

const AnswerSurveyPage = () => {
  const [searchParams] = useSearchParams();
  const surveyID = searchParams.get("survey");

  if (surveyID) {
    return <AnswerSurvey surveyID={surveyID} />;
  } else {
    return <Navigate to="/" />;
  }
};

export default App;
