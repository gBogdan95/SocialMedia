import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";

interface GenericDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
  color: string;
}

const GenericDialog: React.FC<GenericDialogProps> = ({
  open,
  onClose,
  message,
  color,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ fontSize: 20, p: 2, color: color }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          size="large"
          sx={{ width: "60%", mb: 2 }}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenericDialog;
