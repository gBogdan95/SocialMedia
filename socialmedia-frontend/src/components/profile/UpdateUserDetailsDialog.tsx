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
import { validateUpdateProfile } from "../../utils/validate";
import { userService } from "../../services/userService";
import useForm from "../../hooks/useForm";

interface UpdateUserProfileDialogProps {
  open: boolean;
  handleClose: () => void;
  profileId: string;
  initialFormData: {
    name: string;
    phoneNumber: string;
    description: string;
  };
}

const UpdateUserProfileDialog: React.FC<UpdateUserProfileDialogProps> = ({
  open,
  handleClose,
  initialFormData,
}) => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    reset,
    setErrors,
  } = useForm({
    initialValues: initialFormData,
    validate: (name, value) =>
      validateUpdateProfile[name] ? validateUpdateProfile[name](value) : "",
  });

  useEffect(() => {
    if (open) {
      setValues(initialFormData);
      setErrors({ name: "", phoneNumber: "", description: "" });
    }
  }, [open, initialFormData, setValues, setErrors]);

  const handleFormSubmit = async () => {
    try {
      await userService.updateUserProfile(
        values.name,
        values.phoneNumber,
        values.description
      );
      handleClose();
      window.location.reload();
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";
      if (errorMessage.toLowerCase().includes("this name already exists")) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: errorMessage,
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
          Add your personal informations:
        </Typography>
        <form onSubmit={(e) => handleSubmit(e, handleFormSubmit)}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            name="description"
            value={values.description}
            onChange={handleChange}
            multiline
            rows={5}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="phoneNumber"
            label="Phone Number"
            type="phoneNumber"
            fullWidth
            variant="outlined"
            name="phoneNumber"
            value={values.phoneNumber}
            onChange={handleChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />
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
              disabled={!!errors.name || !!errors.phoneNumber}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserProfileDialog;
