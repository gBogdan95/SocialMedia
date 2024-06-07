import React, { useState, useEffect } from "react";
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
import { useAuth } from "../../contexts/AuthContext";
import { validateChangeEmail } from "../../utils/validate";

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

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (open) {
      setFormData({ email: "", password: "" });
      setErrors({ email: "", password: "" });
      setGeneralError("");
    }
  }, [open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const error = validateChangeEmail[name](value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSave = async () => {
    const { email, password } = formData;
    if (!email.trim() || !password.trim()) {
      setErrors({
        email: email.trim() ? "" : "Email is required",
        password: password.trim() ? "" : "Password is required",
      });
      return;
    }

    try {
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
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="New Email"
          type="email"
          fullWidth
          name="email"
          value={formData.email}
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
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
      </DialogContent>
      {generalError && (
        <Typography color="error" sx={{ ml: 3.1, textAlign: "left" }}>
          {generalError}
        </Typography>
      )}
      <DialogActions
        sx={{
          marginBottom: "15px",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            fontSize: "1rem",
            padding: "6px 16px",
            width: "125px",
            color: "white",
            mr: 1,
            backgroundColor: "#40A2D8",
            "&:hover": {
              backgroundColor: "#1450A3",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
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
            !formData.email.trim() ||
            !formData.password.trim() ||
            errors.email !== ""
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeEmailDialog;
