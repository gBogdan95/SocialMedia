import React, { useState } from "react";
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Register() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const { values, errors, handleChange, handleSubmit, setErrors, reset } =
    useForm({
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
      setOpenDialog(true);
      reset();
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";

      console.error("Registration error:", errorMessage);

      if (errorMessage.toLowerCase().includes("error")) {
        setErrors((prevErrors) => ({ ...prevErrors, username: errorMessage }));
      }
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/");
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 30 }}>
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
      <Dialog
        open={openDialog}
        onClose={() => {}}
        aria-labelledby="registration-success-dialog"
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: "400px",
            mx: "auto",
          },
        }}
      >
        <DialogTitle id="registration-success-dialog">
          Registration Complete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have successfully created an account.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleDialogClose}
            color="primary"
            variant="contained"
            size="large"
            sx={{
              width: "75%",
              my: 2,
            }}
          >
            LOG IN
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
