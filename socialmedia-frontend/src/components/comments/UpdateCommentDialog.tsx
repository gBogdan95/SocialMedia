import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { validateComment } from "../../utils/validate";
import useForm from "../../hooks/useForm";

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
  const { values, errors, handleChange, handleSubmit, setValues, reset } =
    useForm({
      initialValues: { content },
      validate: (name, value) => validateComment[name](value),
    });

  useEffect(() => {
    if (open) {
      setValues({ content });
    }
  }, [open, content, setValues]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = async () => {
    onSave(values.content);
    handleClose();
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
        <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
          <TextField
            margin="dense"
            id="text"
            label="Text"
            type="text"
            fullWidth
            name="content"
            multiline
            rows={15}
            value={values.content}
            onChange={handleChange}
            error={!!errors.content}
            helperText={errors.content}
            sx={{ mb: 2 }}
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
                "&.Mui-disabled": {
                  backgroundColor: "lightgray",
                  color: "gray",
                },
              }}
              disabled={!values.content.trim()}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCommentDialog;
