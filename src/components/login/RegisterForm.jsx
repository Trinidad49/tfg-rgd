import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const backUrl = process.env.REACT_APP_BACK

export const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const register = async (email, password) => {
    try {
      const response = await fetch(backUrl+"/register", {
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
        <Box p={4} minWidth={400}>
          <form onSubmit={handleRegister}>
            <Stack spacing={2}>
              <Typography align="center" component="h1" variant="h4">
                Register
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
              onClick={handleRegister}
            >
              Register
            </Button>
            <Divider variant="middle" />
            <Typography color={"gray"} mt={2} style={{ textAlign: "center" }}>
              ¿Ya tienes una cuenta?{" "}
              <Link
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontWeight: "bold",
                }}
                to="/"
              >
                LogIn
              </Link>
            </Typography>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};
