import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material";

export const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Log in a user using email and password
  const logIn = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, handle token
        /*const token = data.token;
        // Store token in local storage or session storage for subsequent requests
        localStorage.setItem("token", token);*/
        localStorage.setItem("userID", data.id);
        onLogin();
        return { success: true };
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

    if ("" === password) {
      setPasswordError("Please enter a password");
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
        <Box p={4} minWidth={400}>
          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <Typography align="center" component="h1" variant="h4">
                LogIn
              </Typography>
              <TextField
                id="standard-basic"
                label="Email"
                variant="standard"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                error={emailError !== ""}
                helperText={emailError}
              />
              <TextField
                id="standard-basic"
                label="Contraseña"
                type="password"
                variant="standard"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                error={passwordError !== ""}
                helperText={passwordError}
              />
            </Stack>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 5 }}
              onClick={handleLogin}
            >
              LogIn
            </Button>
            <Divider variant="middle" />
            <Typography color={"gray"} mt={2} style={{ textAlign: "center" }}>
              ¿No tienes cuenta?{" "}
              <Link
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontWeight: "bold",
                }}
                to="/register"
              >
                Registrate aquí
              </Link>
            </Typography>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};
