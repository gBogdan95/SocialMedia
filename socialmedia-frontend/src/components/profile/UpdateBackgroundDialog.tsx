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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { userService } from "../../services/userService";
import { useNavigate } from "react-router-dom";

interface Inventory {
  id: string;
  profilePictureUrls: string[];
  backgroundPictureUrls: string[];
}

const BackgroundDialog: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [backgroundPics, setBackgroundPics] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInventory = async () => {
      if (open) {
        try {
          const inventory: Inventory = await userService.fetchUserInventory();
          const sortedBackgroundPics = inventory.backgroundPictureUrls.sort();
          setBackgroundPics(sortedBackgroundPics);
        } catch (error) {
          console.error(error);
          setBackgroundPics([]);
        }
      }
    };

    loadInventory();
  }, [open]);

  const handleSelectBackground = async (backgroundUrl: string) => {
    try {
      await userService.updateBackground(backgroundUrl);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Failed to update background:", error);
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
        Background Images Inventory
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon sx={{ color: "white", width: 30, height: 30 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {backgroundPics.length > 0 ? (
          <Grid container spacing={2}>
            {backgroundPics.map((url, index) => (
              <Grid
                item
                xs={12}
                sm={4}
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Box position="relative" width="100%" height="100%">
                  <img
                    src={url}
                    alt={`Background ${index + 1}`}
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
                        cursor: "pointer",
                      }}
                      onClick={() => handleSelectBackground(url)}
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
            You have no background images yet.
          </Typography>
        )}
      </DialogContent>
      {backgroundPics.length === 0 && (
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

export default BackgroundDialog;
