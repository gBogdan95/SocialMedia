import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { settingsService } from "../../services/settingsService";
import { validateChangeEmail } from "../../utils/validate";
import { useAuth } from "../../contexts/AuthContext";
import useForm from "../../hooks/useForm";

interface ChangeEmailDialogProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

const ChangeEmailDialog: React.FC<ChangeEmailDialogProps> = ({
  userId,
  open,
  onClose,
}) => {
  const { updateUser } = useAuth();

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    reset,
    setErrors,
  } = useForm({
    initialValues: { email: "", password: "" },
    validate: (name, value) =>
      validateChangeEmail[name as keyof typeof validateChangeEmail](value),
  });

  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (open) {
      setValues({ email: "", password: "" });
      setErrors({ email: "", password: "" });
      setGeneralError("");
    }
  }, [open, setValues, setErrors]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = async () => {
    try {
      const { email, password } = values;
      const response = await settingsService.updateEmail(
        userId,
        email,
        password
      );
      const { user, jwt } = response;
      updateUser(user, jwt);
      onClose();
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";
      console.error("Update email error:", errorMessage);

      if (errorMessage.toLowerCase().includes("error")) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "This email already exists",
        }));
      } else if (errorMessage.toLowerCase().includes("incorrect password")) {
        setGeneralError("Incorrect password");
      } else {
        setGeneralError(errorMessage);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ mr: 11 }}
    >
      <DialogTitle
        sx={{
          fontSize: 24,
          fontWeight: "bold",
          backgroundColor: "#1450A3",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
          color: "white",
          mb: 1,
        }}
      >
        Change Email
      </DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="New Email"
            type="email"
            fullWidth
            name="email"
            value={values.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            name="password"
            value={values.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          {generalError && (
            <Typography color="error" sx={{ mt: 1, textAlign: "left" }}>
              {generalError}
            </Typography>
          )}
          <DialogActions
            sx={{
              marginTop: "5px",
              justifyContent: "flex-end",
              mt: 1,
              mb: -1,
              mr: -3,
            }}
          >
            <Button
              onClick={handleClose}
              sx={{
                fontSize: "1rem",
                padding: "6px 16px",
                width: "125px",
                color: "white",
                mr: 1.5,
                backgroundColor: "#40A2D8",
                "&:hover": {
                  backgroundColor: "#1450A3",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              sx={{
                fontSize: "1rem",
                padding: "6px 16px",
                width: "125px",
                color: "white",
                mr: 2,
                backgroundColor: "#40A2D8",
                "&:hover": {
                  backgroundColor: "#1450A3",
                },
                "&.Mui-disabled": {
                  backgroundColor: "lightgray",
                  color: "gray",
                },
              }}
              disabled={
                !values.email.trim() ||
                !values.password.trim() ||
                errors.email !== ""
              }
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmailDialog;
