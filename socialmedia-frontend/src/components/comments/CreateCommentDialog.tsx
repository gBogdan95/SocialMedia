import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { validateComment } from "../../utils/validate";

interface CreateCommentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
}

const CreateCommentDialog: React.FC<CreateCommentDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({ content: "" });
  const [errors, setErrors] = useState({ content: "" });

  const handleClose = () => {
    setFormData({ content: "" });
    setErrors({ content: "" });
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    const error = validateComment[name](value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSave = () => {
    const contentError = validateComment.content(formData.content);

    if (!contentError) {
      onSave(formData.content);
      handleClose();
    } else {
      setErrors({ content: contentError });
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
        Add a comment
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: 25, mt: 2 }}>
          What do you think about this post?
        </Typography>
        <TextField
          margin="dense"
          id="post-content"
          label="Content"
          type="text"
          fullWidth
          name="content"
          value={formData.content}
          onChange={handleChange}
          error={!!errors.content}
          helperText={errors.content}
          multiline
          rows={15}
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
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCommentDialog;
