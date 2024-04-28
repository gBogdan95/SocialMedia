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
import { shopService } from "../services/shopService";
import currencyImg from "../assets/currency.png";

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

const DisplayImages = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [error, setError] = useState<string>("");

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

  const renderImageCard = (image: Image) => (
    <Grid
      item
      xs={6}
      sm={4}
      md={2.4}
      key={image.id}
      sx={{ width: "20%", flexGrow: 1 }}
    >
      <Card sx={{ maxWidth: 345, margin: "auto" }}>
        <CardMedia
          component="img"
          height="120"
          image={image.imageUrl}
          alt={image.imageType}
        />
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
              sx={{ fontSize: "1rem" }}
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
    </Container>
  );
};

export default DisplayImages;
