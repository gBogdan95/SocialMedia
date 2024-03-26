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
import { validateComment } from "../utils/validate";

interface UpdateCommentDialogProps {
  open: boolean;
  content: string;
  onClose: () => void;
  onSave: (content: string) => void;
}

const UpdateCommentDialog: React.FC<UpdateCommentDialogProps> = ({
  open,
  content,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({ content });
  const [errors, setErrors] = useState({ content: "" });

  useEffect(() => {
    if (open) {
      setFormData({ content });
      setErrors({ content: "" });
    }
  }, [open, content]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateComment[name](value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSave = () => {
    const contentError = validateComment.content(formData.content);

    if (!contentError) {
      onSave(formData.content);
      onClose();
    } else {
      setErrors({ content: contentError });
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
        Edit Comment
      </DialogTitle>
      <DialogContent>
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
          disabled={!formData.content.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCommentDialog;
