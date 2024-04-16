import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const register = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        navigate("/");
        //onRegister();
        return { success: true };
      } else {
        // Registration failed, handle error message
        if (data.message === "Email already registered") {
          setEmailError("Email ya registrado");
        }
        return { success: false, message: data.message };
      }
    } catch (error) {
      // Handle network errors
      return { success: false, message: "Network error" };
    }
  };

  const handleRegister = (e) => {
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
    //Añadir logica
    register(email, password);
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
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
      <button type="submit">Register</button>
    </form>
  );
};
