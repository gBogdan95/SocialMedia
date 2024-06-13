import React from "react";
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
import useForm from "../../hooks/useForm";

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
  const { values, errors, handleChange, handleSubmit, reset } = useForm({
    initialValues: { content: "" },
    validate: (name, value) => validateComment[name](value),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async () => {
    onSave(values.content);
    handleClose();
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
        <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
          <TextField
            margin="dense"
            id="post-content"
            label="Content"
            type="text"
            fullWidth
            name="content"
            value={values.content}
            onChange={handleChange}
            error={!!errors.content}
            helperText={errors.content}
            multiline
            rows={15}
          />
          <DialogActions
            sx={{
              justifyContent: "flex-end",
              paddingRight: "0px",
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
                backgroundColor: "#40A2D8",
                "&:hover": {
                  backgroundColor: "#1450A3",
                },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommentDialog;
