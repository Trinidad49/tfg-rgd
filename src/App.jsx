import "./App.css";
import { useState } from "react";
import { LoginForm } from "./components/login/LoginForm";
import { RegisterForm } from "./components/login/RegisterForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/survey/Dashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (email, password) => {
    setIsLoggedIn(true);
  };

  const handleRegister = (email, password) => {};

  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={<RegisterForm onRegister={handleRegister} />}
        />
        <Route path="/home" element={<Dashboard />} />
        <Route
          exact
          path="/"
          element={
            isLoggedIn ? <Dashboard /> : <LoginForm onLogin={handleLogin} />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
