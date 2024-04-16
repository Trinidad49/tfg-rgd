import React, { useState } from "react";
import { Link } from "react-router-dom";

export const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Log in a user using email and password
  const logIn = async (email, password) => {
    console.log("Logging in with: ", email, password);
    try {
      const response = await fetch("http://localhost:3080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Login successful, handle token
        const token = data.token;
        // Store token in local storage or session storage for subsequent requests
        localStorage.setItem("token", token);
        onLogin();
        return { success: true, token };
      } else {
        // Login failed, handle error message
        return { success: false, message: data.message };
      }
    } catch (error) {
      // Handle network errors
      return { success: false, message: "Network error" };
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    //validate email and password
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
    logIn(email, password);
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
