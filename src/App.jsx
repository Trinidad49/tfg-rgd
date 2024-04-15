import "./App.css";
import { LoginForm } from "./components/login/LoginForm";
import { RegisterForm } from "./components/login/RegisterForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const handleLogin = (email, password) => {
    //Logica del login
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
        <Route exact path="/" element={<LoginForm onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
};

export default App;
