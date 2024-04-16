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
import { validateChangePassword } from "../utils/validate";

interface ChangePasswordDialogProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  userId,
  open,
  onClose,
}) => {
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    generalError: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        generalError: "",
      });
    }
  }, [open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        [name]: validateChangePassword[name](value, formData.newPassword),
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: validateChangePassword[name](value),
      }));
    }
  };

  const handleSave = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrors({
        ...errors,
        currentPassword: currentPassword ? "" : "Current password is required",
        newPassword: newPassword ? "" : "New password is required",
        confirmPassword: confirmPassword
          ? ""
          : "Confirm new password is required",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    try {
      const response = await settingsService.updatePassword(
        userId,
        currentPassword,
        newPassword
      );
      updateUser(response.user, response.jwt);
      onClose();
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";
      console.error("Update password error:", errorMessage);
      setErrors((prev) => ({ ...prev, generalError: errorMessage }));
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
        Change Password
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="currentPassword"
          label="Current Password"
          type="password"
          fullWidth
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          error={!!errors.currentPassword}
          helperText={errors.currentPassword}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          id="newPassword"
          label="New Password"
          type="password"
          fullWidth
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          id="confirmPassword"
          label="Confirm New Password"
          type="password"
          fullWidth
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
      </DialogContent>
      {errors.generalError && (
        <Typography color="error" sx={{ ml: 3.1, textAlign: "left" }}>
          {errors.generalError}
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
            !formData.currentPassword.trim() ||
            !formData.newPassword.trim() ||
            formData.newPassword !== formData.confirmPassword
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
