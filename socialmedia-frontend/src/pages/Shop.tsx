import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  CardContent,
  Container,
  Box,
} from "@mui/material";
import currencyImg from "../assets/currency.png";
import GenericDialog from "../components/GenericDialog";
import { shopService } from "../services/shopService";

enum ImageType {
  PROFILE = "PROFILE",
  BACKGROUND = "BACKGROUND",
}

interface Image {
  id: string;
  imageUrl: string;
  price: number;
  imageType: ImageType;
}

const Shop = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [dialogInfo, setDialogInfo] = useState({
    open: false,
    message: "",
    color: "black",
  });
  const [error, setError] = useState<string>("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleMouseEnter = (id: string) => {
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const fetchedImages = await shopService.getAllImages();
        setImages(fetchedImages);
      } catch (error: any) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchImages();
  }, []);

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  const profileImages = images.filter((image) => image.imageType === "PROFILE");
  const backgroundImages = images.filter(
    (image) => image.imageType === "BACKGROUND"
  );

  const handleCardClick = async (itemId: string) => {
    try {
      const response = await shopService.purchaseImage(itemId);
      setDialogInfo({
        open: true,
        message: "The image has been added to your inventory.",
        color: "black",
      });
    } catch (error: any) {
      console.error(error);
      let message = "An error occurred during the purchase.";
      let color = "red";
      if (
        error.message.includes(
          "You have insufficient funds to purchase this image"
        )
      ) {
        message = "You have insufficient funds.";
      } else if (error.message.includes("already own")) {
        message = "You already own this image.";
      }
      setDialogInfo({ open: true, message, color });
    }
  };

  const handleCloseDialog = () => setDialogInfo({ ...dialogInfo, open: false });

  const renderImageCard = (image: Image) => (
    <Grid
      item
      xs={6}
      sm={4}
      md={2.4}
      key={image.id}
      sx={{ width: "20%", flexGrow: 1 }}
    >
      <Card
        sx={{
          maxWidth: 345,
          margin: "auto",
          position: "relative",
          overflow: "hidden",
          "&:hover .overlay": {
            opacity: 1,
            visibility: "visible",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          "&:hover .image": {
            filter: "blur(3px)",
          },
        }}
        onClick={() => handleCardClick(image.id)}
        onMouseEnter={() => handleMouseEnter(image.id)}
        onMouseLeave={handleMouseLeave}
      >
        <CardMedia
          component="img"
          height="120"
          image={image.imageUrl}
          alt={image.imageType}
          className="image"
          sx={{
            ...(image.imageType === ImageType.PROFILE && {
              borderRadius: "50%",
              width: "110px",
              height: "110px",
              objectFit: "cover",
              mx: "auto",
              my: 1,
            }),
          }}
        />
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            opacity: 0,
            visibility: "hidden",
            cursor: "pointer",
            ...(hoveredId === image.id && {
              opacity: 1,
              visibility: "visible",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }),
          }}
        >
          Purchase
        </Box>
        <CardContent
          sx={{
            padding: "16px",
            "&:last-child": { paddingBottom: "16px" },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "1rem", fontWeight: "bold" }}
            >
              Price: {image.price.toFixed(2)}
            </Typography>
            <img src={currencyImg} alt="Currency" height="20" />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container>
      <Typography
        variant="h6"
        sx={{
          mt: 1,
          fontSize: 24,
          fontWeight: "bold",
          backgroundColor: "#1450A3",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
          color: "white",
          p: 1,
        }}
      >
        Avatar Images Shop
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {profileImages.map(renderImageCard)}
      </Grid>
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          fontSize: 24,
          fontWeight: "bold",
          backgroundColor: "#1450A3",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
          color: "white",
          p: 1,
        }}
      >
        Background Images Shop
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {backgroundImages.map(renderImageCard)}
      </Grid>
      <GenericDialog
        open={dialogInfo.open}
        onClose={handleCloseDialog}
        message={dialogInfo.message}
        color={dialogInfo.color}
      />
    </Container>
  );
};

export default Shop;
