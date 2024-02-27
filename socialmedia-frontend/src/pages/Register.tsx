import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

export default function Register() {
  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: implement register logic
    console.log('Register form submitted');
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
