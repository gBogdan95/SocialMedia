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
import { validatePost } from "../../utils/validate";
import { postService } from "../../services/postService";
import CloseIcon from "@mui/icons-material/Close";
import useForm from "../../hooks/useForm";

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
  const { values, errors, handleChange, handleSubmit, reset } = useForm({
    initialValues: { title: "", content: "" },
    validate: (name, value) => validatePost[name](value),
  });

  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleClose = () => {
    reset();
    setImagePreviewUrl(null);
    onClose();
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

  const onSubmit = async () => {
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

    onSave(values.title, values.content, imageUrl);
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
        Create a new post
      </DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
          <TextField
            autoFocus
            margin="dense"
            id="post-title"
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
            id="post-content"
            label="Description"
            type="text"
            fullWidth
            name="content"
            value={values.content}
            onChange={handleChange}
            error={!!errors.content}
            helperText={errors.content}
            multiline
            rows={8}
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
              left: 9,
              bottom: 6,
            }}
          >
            <AddPhotoAlternateIcon sx={{ width: 60, height: 60 }} />
          </IconButton>
          <DialogActions
            sx={{
              justifyContent: "flex-end",
              mt: 1,
              mb: -1,
              pr: 0,
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

export default CreatePostDialog;
