import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { authService } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      await authService.register(
        data.get('username') as string,
        data.get('password') as string,
        data.get('email') as string
      );
      // If the registration was successful, redirect to the login page
      navigate('/');
    } catch (error) {
      // Handle errors, e.g., display an error message from the error object
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Container>
    </React.Fragment>
  );
}
