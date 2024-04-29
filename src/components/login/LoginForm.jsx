import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  Stack,
} from "@mui/material";

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
    <Box
      sx={{
        marginTop: 15,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper elevation={3}>
        <Box p={3} minWidth={400}>
          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <Typography align="center" component="h1" variant="h5">
                LogIn
              </Typography>
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                error={emailError !== ""}
                helperText={emailError}
              />
              <TextField
                id="outlined-basic"
                label="Contraseña"
                variant="outlined"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                error={passwordError !== ""}
                helperText={passwordError}
              />
            </Stack>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              LogIn
            </Button>
            <p style={{ textAlign: "end" }}>
              ¿No tienes cuenta? <Link to="/register">Registrate</Link>
            </p>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};
