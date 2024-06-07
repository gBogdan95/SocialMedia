import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Button,
  Typography,
  IconButton,
  Box,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { userService } from "../../services/userService";
import { useNavigate } from "react-router-dom";

interface Inventory {
  id: string;
  profilePictureUrls: string[];
  backgroundPictureUrls: string[];
}

const AvatarDialog: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [profilePics, setProfilePics] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInventory = async () => {
      if (open) {
        try {
          const inventory: Inventory = await userService.fetchUserInventory();
          const sortedProfilePics = inventory.profilePictureUrls.sort();
          setProfilePics(sortedProfilePics);
        } catch (error) {
          console.error(error);
          setProfilePics([]);
        }
      }
    };

    loadInventory();
  }, [open]);

  const handleSelectAvatar = async (avatarUrl: string) => {
    try {
      await userService.updateAvatar(avatarUrl);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Failed to update avatar:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 24,
          fontWeight: "bold",
          backgroundColor: "#1450A3",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
          color: "white",
          mb: 2,
        }}
      >
        Avatar Images Inventory
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon sx={{ color: "white", width: 30, height: 30 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {profilePics.length > 0 ? (
          <Grid container spacing={2}>
            {profilePics.map((url, index) => (
              <Grid
                item
                xs={12}
                sm={2}
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Box position="relative" width="100%" height="100%">
                  <img
                    src={url}
                    alt={`Profile ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      transition: "filter 0.3s",
                    }}
                  />
                  {hoveredIndex === index && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(2px)",
                        transition: "opacity 0.3s",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSelectAvatar(url)}
                    >
                      <Typography variant="h6">Select</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ fontSize: 30, mb: -2 }}>
            You have no avatars yet.
          </Typography>
        )}
      </DialogContent>
      {profilePics.length === 0 && (
        <Box textAlign="center" p={2}>
          <Button
            variant="contained"
            onClick={() => navigate("/shop")}
            color="primary"
            sx={{ fontSize: 20 }}
          >
            Go to Shop
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default AvatarDialog;
