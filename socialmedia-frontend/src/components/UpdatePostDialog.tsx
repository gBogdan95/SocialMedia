import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

interface UpdatePostDialogProps {
  open: boolean;
  title: string;
  text: string;
  onClose: () => void;
  onSave: (title: string, text: string) => void;
}

const UpdatePostDialog: React.FC<UpdatePostDialogProps> = ({
  open,
  title,
  text,
  onClose,
  onSave,
}) => {
  const [editTitle, setEditTitle] = React.useState(title);
  const [editText, setEditText] = React.useState(text);

  React.useEffect(() => {
    if (!open) {
      setEditTitle(title);
      setEditText(text);
    }
  }, [open, title, text]);

  const handleSave = () => {
    onSave(editTitle, editText);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle id="form-dialog-title">Edit Post</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          sx={{ mb: 2, mt: 4 }}
        />
        <TextField
          margin="dense"
          id="text"
          label="Text"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={15}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
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
          disabled={!editTitle.trim() || !editText.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePostDialog;
