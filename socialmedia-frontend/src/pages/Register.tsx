import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link as MuiLink,
} from "@mui/material";
import useForm from "../hooks/useForm";
import { validateRegister } from "../utils/validate";
import { authService } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const { values, errors, handleChange, handleSubmit, setErrors } = useForm({
    initialValues: {
      username: "",
      password: "",
      email: "",
    },
    validate: (name, value) => {
      return validateRegister[name] ? validateRegister[name](value) : "";
    },
  });

  const handleRegister = async () => {
    try {
      await authService.register(
        values.username,
        values.password,
        values.email
      );
      navigate("/");
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";

      if (errorMessage.toLowerCase().includes("this username already exists")) {
        setErrors((prevErrors) => ({ ...prevErrors, username: errorMessage }));
      } else {
        console.error("Registration error:", errorMessage);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <Box
        component="form"
        onSubmit={(e) => handleSubmit(e, handleRegister)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={values.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="email"
          label="Email Address"
          type="email"
          id="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
          Already have an account?{" "}
          <MuiLink component={RouterLink} to="/" underline="none">
            Sign In
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
}
