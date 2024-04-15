import "./App.css";
import { useState } from "react";
import { LoginForm } from "./components/login/LoginForm";
import { RegisterForm } from "./components/login/RegisterForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/survey/Dashboard";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (email, password) => {
    //Logica del login
    setIsLoggedIn(true);
    console.log("Logging in with:", email, password);
  };

  const handleRegister = (email, password) => {
    //Logica de registro
    console.log("Registering with:", email, password);
  };

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
