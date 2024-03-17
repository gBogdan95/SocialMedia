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
import { validateRegister } from "../utils/validate";
import { userService } from "../services/userService";

interface UpdateUserProfileDialogProps {
  open: boolean;
  handleClose: () => void;
  profileId: string;
  initialFormData: {
    username: string;
    email: string;
    description: string;
  };
}

const UpdateUserProfileDialog: React.FC<UpdateUserProfileDialogProps> = ({
  open,
  handleClose,
  profileId,
  initialFormData,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    if (open) {
      setFormData(initialFormData);
      setErrors({ username: "", email: "" });
    }
  }, [open, initialFormData]);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    const validationError = validateRegister[name]
      ? validateRegister[name](value)
      : "";
    setErrors({ ...errors, [name]: validationError });
  };

  const handleFormSubmit = async () => {
    try {
      await userService.updateUserProfile(
        profileId,
        formData.username,
        formData.email,
        formData.description
      );
      handleClose();
      window.location.reload();
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";
      if (errorMessage.toLowerCase().includes("this username already exists")) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: errorMessage,
        }));
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          fontSize: 24,
          fontWeight: "bold",
          backgroundColor: "#1450A3",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
          color: "white",
        }}
      >
        Edit Profile
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: 25, mt: 2 }}>
          Change username/email:
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          type="text"
          fullWidth
          variant="outlined"
          name="username"
          value={formData.username}
          onChange={handleFormChange}
          error={!!errors.username}
          helperText={errors.username}
          sx={{ mb: 2, mt: 2 }}
        />
        <TextField
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          name="email"
          value={formData.email}
          onChange={handleFormChange}
          error={!!errors.email}
          helperText={errors.email}
          sx={{ mb: 5 }}
        />
        <Typography sx={{ fontSize: 25, mb: 1 }}>
          Tell something about you:
        </Typography>
        <TextField
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          name="description"
          value={formData.description}
          onChange={handleFormChange}
          multiline
          rows={5}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          marginBottom: "15px",
        }}
      >
        <Button
          onClick={handleClose}
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
          onClick={handleFormSubmit}
          disabled={
            !!errors.username ||
            !!errors.email ||
            !formData.username.trim() ||
            !formData.email.trim()
          }
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
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateUserProfileDialog;
