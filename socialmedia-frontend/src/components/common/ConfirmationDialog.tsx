import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
    >
      <DialogContent sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <DialogContentText
          sx={{ textAlign: "center", color: "black", fontSize: "20px" }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "space-between", padding: "15px 24px" }}
      >
        <Button
          onClick={onCancel}
          fullWidth
          sx={{
            color: "white",
            backgroundColor: "#40A2D8",
            "&:hover": {
              backgroundColor: "#1450A3",
            },
            marginRight: "8px",
          }}
        >
          No
        </Button>
        <Button
          onClick={onConfirm}
          fullWidth
          sx={{
            color: "white",
            backgroundColor: "#D24545",
            "&:hover": {
              backgroundColor: "red",
            },
            marginLeft: "8px",
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
