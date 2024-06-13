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
  Typography,
} from "@mui/material";
import { validatePost } from "../../utils/validate";
import { postService } from "../../services/postService";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import useForm from "../../hooks/useForm"; // Adjust the path based on your file structure

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
  const { values, errors, handleChange, handleSubmit, setValues, reset } =
    useForm({
      initialValues: { title, content },
      validate: (name, value) => validatePost[name](value),
    });

  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    imageUrl || null
  );

  useEffect(() => {
    if (open) {
      setValues({ title, content });
      setImagePreviewUrl(imageUrl || null);
      reset();
    }
  }, [open, title, content, imageUrl, setValues]);

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

  const onSubmit = async () => {
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

    onSave(values.title, values.content, imageUrl);
    onClose();
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
        <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            name="title"
            value={values.title}
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
            rows={8}
            value={values.content}
            onChange={handleChange}
            error={!!errors.content}
            helperText={errors.content}
          />
          {imagePreviewUrl && (
            <>
              <Typography sx={{ fontSize: 25, mt: 2, mb: 2 }}>
                Image preview:
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <Box
                    component="img"
                    src={imagePreviewUrl}
                    alt="Preview"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      display: "block",
                    }}
                  />
                  <IconButton
                    aria-label="remove image"
                    onClick={() => setImagePreviewUrl(null)}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
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
                </Box>
              </Box>
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
              type="submit"
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
              disabled={!values.title.trim() || !values.content.trim()}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePostDialog;
