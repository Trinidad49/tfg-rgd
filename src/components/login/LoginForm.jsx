import React, { useState } from "react";
import { Link } from "react-router-dom";

export const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
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
      </div>
      <div>
        <input
          type="password"
          value={password}
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
      <p>
        ¿No tienes cuenta? <Link to="/register">Registrate</Link>
      </p>
    </form>
  );
};
