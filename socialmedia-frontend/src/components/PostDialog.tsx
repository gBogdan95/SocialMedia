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
import { validatePost } from "../utils/validate";

interface PostDialogProps {
  open: boolean;
  handleClose: () => void;
  handleSavePost: (title: string, postContent: string) => void;
}

const PostDialog: React.FC<PostDialogProps> = ({
  open,
  handleClose: propHandleClose,
  handleSavePost,
}) => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [errors, setErrors] = useState({ title: "", content: "" });

  const handleClose = () => {
    setFormData({ title: "", content: "" });
    setErrors({ title: "", content: "" });
    propHandleClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    const error = validatePost[name](value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSave = () => {
    const titleError = validatePost.title(formData.title);
    const contentError = validatePost.content(formData.content);

    if (!titleError && !contentError) {
      handleSavePost(formData.title, formData.content);
      handleClose();
    } else {
      setErrors({ title: titleError, content: contentError });
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
        Create a new post
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: 25, mt: 2 }}>Choose a title:</Typography>
        <TextField
          autoFocus
          margin="dense"
          id="post-title"
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
        <Typography sx={{ fontSize: 25, mt: 2 }}>
          Share something intersing:
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

export default PostDialog;
