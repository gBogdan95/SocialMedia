import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { authService } from '../services/authService';

interface FormValues {
  username: string;
  password: string;
  email: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  email?: string;
}

export default function Register() {
  const navigate = useNavigate();
    const [formValues, setFormValues] = useState<FormValues>({
    username: '',
    password: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let errors: FormErrors = { ...formErrors };

    switch (name) {
      case 'username':
        errors.username = value ? '' : 'Username is required';
        break;
      case 'password':
        errors.password = value.length >= 6 ? '' : 'Password must be at least 6 characters';
        break;
      case 'email':
        errors.email = /\S+@\S+\.\S+/.test(value) ? '' : 'Email must be a valid email address';
        break;
      default:
        break;
    }

    setFormErrors(errors);
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await authService.register(formValues.username, formValues.password, formValues.email);
        navigate('/');
      } catch (error: any) {

        const errorMessage = error.message || 'An unknown error occurred';
        
        if (errorMessage.toLowerCase().includes('this username already exists')) {
          setFormErrors(prevErrors => ({ ...prevErrors, username: errorMessage }));
        } else {
          console.error('Registration error:', errorMessage);
        }
      }
      
    }
  };

  const validateForm = () => {
    let errors: FormErrors = {};
    let formIsValid = true;

    if (!formValues.username) {
      formIsValid = false;
      errors.username = 'Username is required';
    }

    if (formValues.password.length < 6) {
      formIsValid = false;
      errors.password = 'Password must be at least 6 characters';
    }

    if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      formIsValid = false;
      errors.email = 'Email must be a valid email address';
    }

    setFormErrors(errors);
    return formIsValid;
  };

  return (
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
        value={formValues.username}
        onChange={handleInputChange}
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
          autoComplete="new-password"
          value={formValues.password}
          onChange={handleInputChange}
          error={!!formErrors.password}
          helperText={formErrors.password}
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
          value={formValues.email}
          onChange={handleInputChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account? <RouterLink to="/">Sign In</RouterLink>
        </Typography>
      </Box>
    </Container>
  );
}
