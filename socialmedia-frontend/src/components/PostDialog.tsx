// PostDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

interface PostDialogProps {
  open: boolean;
  handleClose: () => void;
  handleSavePost: (postContent: string) => void;
}

const PostDialog: React.FC<PostDialogProps> = ({
  open,
  handleClose,
  handleSavePost,
}) => {
  const [postContent, setPostContent] = useState("");

  const handleSave = () => {
    handleSavePost(postContent);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Create a new post</DialogTitle>
      <DialogContent>
        <DialogContentText>Write anything it's on your mind</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="post-content"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={15}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
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
          disabled={!postContent.trim()}
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
