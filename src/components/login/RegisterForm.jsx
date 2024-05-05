import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

    if (!/^[\w-]+@([\w-])+.+[\w-]{2,4}$/.test(email)) {
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
          <form onSubmit={handleRegister}>
            <Stack spacing={2}>
              <Typography align="center" component="h1" variant="h5">
                Register
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
                type="password"
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
              onClick={handleRegister}
            >
              Register
            </Button>
            <Button variant="text">
              <Link to="/">Volver</Link>
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};
