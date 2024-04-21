import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { validatePost } from "../utils/validate";
import { postService } from "../services/postService";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface UpdatePostDialogProps {
  open: boolean;
  title: string;
  content: string;
  imageUrl?: string | null;
  onClose: () => void;
  onSave: (title: string, content: string, imageUrl?: string | null) => void;
}

const UpdatePostDialog: React.FC<UpdatePostDialogProps> = ({
  open,
  title,
  content,
  imageUrl,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({ title, content });
  const [errors, setErrors] = useState({ title: "", content: "" });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    imageUrl || null
  );

  useEffect(() => {
    if (open) {
      setFormData({ title, content });
      setImagePreviewUrl(imageUrl || null);
      setErrors({ title: "", content: "" });
    }
  }, [open, title, content, imageUrl]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validatePost[name](value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
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
      let imageUrl: string | undefined = imagePreviewUrl || undefined;

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
      onClose();
    } else {
      setErrors({ title: titleError, content: contentError });
    }
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
        Edit Post
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
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
          id="text"
          label="Description"
          type="text"
          fullWidth
          name="content"
          multiline
          rows={12}
          value={formData.content}
          onChange={handleChange}
          error={!!errors.content}
          helperText={errors.content}
          sx={{ mb: 2 }}
        />
        {imagePreviewUrl && (
          <Box
            component="img"
            src={imagePreviewUrl}
            alt="Preview"
            sx={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
          />
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
          disabled={!formData.title.trim() || !formData.content.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePostDialog;
