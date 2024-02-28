import React, {useState} from 'react';
import { Container, Typography, TextField, Button, Box, Grid, } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({ username: '', password: '' });

  const validateField = (name: string, value: string) => {
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: value.trim().length === 0 ? 'This field cannot be empty' : ''
    }));
  };
  
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    validateField(event.target.name, event.target.value);
  };
  
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    validateField(event.target.name, event.target.value);
  };
  
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setFormErrors({
        username: !username.trim() ? 'Username cannot be empty' : '',
        password: !password.trim() ? 'Password cannot be empty' : '',
      });
      return;
    }

    setError('');
    try {
      const data = await authService.login(username, password);
      const jwt = data.jwt;
      localStorage.setItem('token', jwt);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        console.error('Login error:', error.message);
      } else {
        setError('An unexpected error occurred.');
        console.error('Login error:', error);
      }
    }
  };

  let errorMessage = null;
  if (error) {
    errorMessage = (
      <Typography color="error" sx={{ mt: 2 }}>
        {error}
      </Typography>
    );
  }

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
          value={username}
          onChange={handleUsernameChange}
          error={!!formErrors.username}
          helperText={formErrors.username}
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
          value={password}
          onChange={handlePasswordChange}
          error={!!formErrors.password}
          helperText={formErrors.password}
        />
        {errorMessage}
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

