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
import { useAuth } from "../../contexts/AuthContext";
import useForm from "../../hooks/useForm";
import { validateChangePassword } from "../../utils/validate";

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

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    reset,
    setErrors,
  } = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    validate: (name, value) => validateChangePassword[name](value),
  });

  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (open) {
      setValues({
        currentPassword: "",
        newPassword: "",
      });
      setErrors({
        currentPassword: "",
        newPassword: "",
      });
      setGeneralError("");
    }
  }, [open, setValues, setErrors]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = async () => {
    try {
      const { currentPassword, newPassword } = values;
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
      setGeneralError("Incorrect password");
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
        <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
          <TextField
            autoFocus
            margin="dense"
            id="currentPassword"
            label="Current Password"
            type="password"
            fullWidth
            name="currentPassword"
            value={values.currentPassword}
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
            value={values.newPassword}
            onChange={handleChange}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            sx={{ mb: 2 }}
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
                !values.currentPassword.trim() || !values.newPassword.trim()
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

export default ChangePasswordDialog;
