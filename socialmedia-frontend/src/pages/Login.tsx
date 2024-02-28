import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Link as MuiLink,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateLogin } from "../utils/validate";
import { authService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, handleChange, handleSubmit, reset } = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: (name, value) => {
      return validateLogin[name] ? validateLogin[name](value) : "";
    },
  });

  const [generalError, setGeneralError] = useState("");

  const handleLogin = async () => {
    try {
      const data = await authService.login(values.username, values.password);
      login(data.jwt);
      navigate("/dashboard");
    } catch (error) {
      setGeneralError("Incorrect username or password");
      reset();
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Typography component="h1" variant="h5">
        Log In
      </Typography>
      <Box
        component="form"
        onSubmit={(e) => handleSubmit(e, handleLogin)}
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
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        {generalError && (
          <Typography color="error" sx={{ mt: 2, textAlign: "left" }}>
            {generalError}
          </Typography>
        )}
        <Grid container>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Forgot your{" "}
            <MuiLink
              component={RouterLink}
              to="/reset-username"
              underline="none"
            >
              username
            </MuiLink>{" "}
            or{" "}
            <MuiLink
              component={RouterLink}
              to="/reset-password"
              underline="none"
            >
              password
            </MuiLink>
            ?
          </Typography>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
          You don't have an account?{" "}
          <MuiLink component={RouterLink} to="/register" underline="none">
            Register
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
}
