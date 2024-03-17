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
import { validatePost } from "../utils/validate";

interface UpdatePostDialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

const UpdatePostDialog: React.FC<UpdatePostDialogProps> = ({
  open,
  title,
  content,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({ title, content });
  const [errors, setErrors] = useState({ title: "", content: "" });

  useEffect(() => {
    if (open) {
      setFormData({ title, content });
      setErrors({ title: "", content: "" });
    }
  }, [open, title, content]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validatePost[name](value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSave = () => {
    const titleError = validatePost.title(formData.title);
    const contentError = validatePost.content(formData.content);

    if (!titleError && !contentError) {
      onSave(formData.title, formData.content);
      onClose();
    } else {
      setErrors({ title: titleError, content: contentError });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          fontSize: 24,
          fontWeight: "bold",
          backgroundColor: "#1450A3",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
          color: "white",
        }}
      >
        Edit Post
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: 25, mt: 2 }}>Change title:</Typography>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          sx={{ mb: 2 }}
        />
        <Typography sx={{ fontSize: 25, mt: 2 }}>Change content:</Typography>
        <TextField
          margin="dense"
          id="text"
          label="Text"
          type="text"
          fullWidth
          name="content"
          multiline
          rows={15}
          value={formData.content}
          onChange={handleChange}
          error={!!errors.content}
          helperText={errors.content}
          sx={{ mb: 2 }}
        />
      </DialogContent>
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
          disabled={!formData.title.trim() || !formData.content.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePostDialog;
