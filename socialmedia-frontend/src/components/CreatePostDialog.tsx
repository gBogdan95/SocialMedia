import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { validatePost } from "../utils/validate";
import { postService } from "../services/postService";
import CloseIcon from "@mui/icons-material/Close";

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, postContent: string, imageUrl?: string) => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [errors, setErrors] = useState({ title: "", content: "" });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleClose = () => {
    setFormData({ title: "", content: "" });
    setErrors({ title: "", content: "" });
    setImagePreviewUrl(null);
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    const error = validatePost[name](value);
    setErrors({ ...errors, [name]: error });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
    } else {
      setImageFile(undefined);
      setImagePreviewUrl(null);
    }
  };

  const handleImageUploadClick = () => {
    const fileInput = document.getElementById(
      "image-upload-input"
    ) as HTMLInputElement;
    fileInput.click();
  };

  const handleSave = async () => {
    const titleError = validatePost.title(formData.title);
    const contentError = validatePost.content(formData.content);

    if (!titleError && !contentError) {
      let imageUrl: string | undefined = undefined;

      if (imageFile) {
        try {
          imageUrl = await postService.uploadImage(imageFile);
        } catch (error) {
          console.error("Failed to upload image:", error);
          alert("Failed to upload image. Please try again.");
          return;
        }
      }

      onSave(formData.title, formData.content, imageUrl);
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
          sx={{ mb: 2, mt: 2 }}
        />
        <TextField
          margin="dense"
          id="post-content"
          label="Description"
          type="text"
          fullWidth
          name="content"
          value={formData.content}
          onChange={handleChange}
          error={!!errors.content}
          helperText={errors.content}
          multiline
          rows={4}
        />
        {imagePreviewUrl && (
          <>
            <Typography sx={{ fontSize: 25, mt: 2, mb: 2 }}>
              Image preview:
            </Typography>
            <Box
              component="img"
              src={imagePreviewUrl}
              alt="Preview"
              sx={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
            />
            <IconButton
              aria-label="remove image"
              onClick={() => setImagePreviewUrl(null)}
              sx={{
                position: "absolute",
                right: 195,
                top: 375,
                color: "lightgrey",
                backgroundColor: "rgba(0, 0, 0, 0.65)",
                borderRadius: "50px",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              <CloseIcon
                sx={{
                  "&:hover": {
                    color: "white",
                  },
                }}
              />
            </IconButton>
          </>
        )}
        <input
          type="file"
          id="image-upload-input"
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/*"
        />
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={handleImageUploadClick}
          sx={{
            position: "absolute",
            left: 8,
            bottom: 8,
          }}
        >
          <AddPhotoAlternateIcon sx={{ width: 60, height: 60 }} />
        </IconButton>
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

export default CreatePostDialog;
