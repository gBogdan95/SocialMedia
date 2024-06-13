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
import { validateChangeUsername } from "../../utils/validate";
import { useAuth } from "../../contexts/AuthContext";
import useForm from "../../hooks/useForm";

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

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    reset,
    setErrors,
  } = useForm({
    initialValues: { newUsername: "", password: "" },
    validate: (name, value) =>
      validateChangeUsername[name as keyof typeof validateChangeUsername](
        value
      ),
  });

  const [credentialsError, setCredentialsError] = useState("");

  useEffect(() => {
    if (open) {
      setValues({ newUsername: "", password: "" });
      setErrors({ newUsername: "", password: "" });
      setCredentialsError("");
    }
  }, [open, setValues, setErrors]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = async () => {
    try {
      const { newUsername, password } = values;
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
      } else {
        setCredentialsError("Incorrect username or password");
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
        Change Username
      </DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
          <TextField
            autoFocus
            margin="dense"
            id="newUsername"
            label="New Username"
            type="text"
            fullWidth
            name="newUsername"
            value={values.newUsername}
            onChange={handleChange}
            error={!!errors.newUsername}
            helperText={errors.newUsername}
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
          {credentialsError && (
            <Typography color="error" sx={{ mt: 1, textAlign: "left" }}>
              {credentialsError}
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
              disabled={!values.newUsername.trim() || !values.password.trim()}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeUsernameDialog;
