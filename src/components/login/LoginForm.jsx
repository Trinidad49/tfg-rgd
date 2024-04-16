import React, { useState } from "react";
import { Link } from "react-router-dom";

export const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if ("" === email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!/^[\w-]+@([\w-])+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 7) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }

    //Añadir logica para el login
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <div>
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>{emailError}</label>
      </div>
      <div>
        <input
          type="password"
          value={password}
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>{passwordError}</label>
      </div>
      <button onClick={handleLogin}>Login</button>
      <p>
        ¿No tienes cuenta? <Link to="/register">Registrate</Link>
      </p>
    </form>
  );
};
