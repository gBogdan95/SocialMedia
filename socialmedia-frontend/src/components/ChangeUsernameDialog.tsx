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
import { settingsService } from "../services/settingsService";
import { useAuth } from "../contexts/AuthContext";

interface ChangeUsernameDialogProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

const ChangeUsernameDialog: React.FC<ChangeUsernameDialogProps> = ({
  userId,
  open,
  onClose,
}) => {
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({ newUsername: "", password: "" });
  const [errors, setErrors] = useState({ newUsername: "", password: "" });

  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (open) {
      setFormData({ newUsername: "", password: "" });
      setErrors({ newUsername: "", password: "" });
      setGeneralError("");
    }
  }, [open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value.trim() ? "" : "This field cannot be empty",
    }));
  };

  const handleSave = async () => {
    const { newUsername, password } = formData;
    if (!newUsername.trim() || !password.trim()) {
      setErrors({
        newUsername: newUsername.trim() ? "" : "This field cannot be empty",
        password: password.trim() ? "" : "This field cannot be empty",
      });
      return;
    }

    try {
      const response = await settingsService.updateUsername(
        userId,
        newUsername,
        password
      );
      const { user, jwt } = response;
      updateUser(user, jwt);
      window.location.reload();
      onClose();
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";

      console.error("Update username error:", errorMessage);

      if (errorMessage.toLowerCase().includes("error")) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          newUsername: errorMessage,
        }));
      } else if (errorMessage.toLowerCase().includes("incorrect password")) {
        setGeneralError("Incorrect password");
      } else {
        setGeneralError(errorMessage);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
        Change Username
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="newUsername"
          label="New Username"
          type="text"
          fullWidth
          name="newUsername"
          value={formData.newUsername}
          onChange={handleChange}
          error={!!errors.newUsername}
          helperText={errors.newUsername}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          id="password"
          label="Current Password"
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
          disabled={!formData.newUsername.trim() || !formData.password.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeUsernameDialog;
