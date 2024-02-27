import React from 'react';
import { Container, Typography, TextField, Button, Box, Grid, Link,} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO implement login logic
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Typography component="h1" variant="h5">
        Log In
      </Typography>
      <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
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
          autoComplete="current-password"
        />
        <Grid container>
          <Typography variant="body2" sx={{ mt: 2 }}>
          Forgot your <RouterLink to="/reset-username">username</RouterLink> or <RouterLink to="/reset-password">password</RouterLink> ?
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
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
          You don't have an account? <RouterLink to="/register">Register</RouterLink>
        </Typography>
      </Box>
    </Container>
  );
}

