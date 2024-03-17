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
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [postContent, setPostContent] = useState("");
  const [contentError, setContentError] = useState("");

  const handleClose = () => {
    setTitle("");
    setPostContent("");
    setTitleError("");
    setContentError("");
    propHandleClose();
  };

  const handleSave = () => {
    setTitleError("");
    setContentError("");

    let isValid = true;
    if (!title.trim()) {
      setTitleError("Title is required!");
      isValid = false;
    }
    if (!postContent.trim()) {
      setContentError("Content is required!");
      isValid = false;
    }

    if (isValid) {
      handleSavePost(title, postContent);
      handleClose();
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
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!titleError}
          helperText={titleError}
          sx={{ mb: 2, mt: 2 }}
        />
        <Typography sx={{ fontSize: 25, mt: 2 }}>
          Share something intersing:
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="post-content"
          label="Content"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={15}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          error={!!contentError}
          helperText={contentError}
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

export default PostDialog;
