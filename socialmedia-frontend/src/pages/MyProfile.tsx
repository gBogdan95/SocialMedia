import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import currencyImg from "../assets/currency.png";
import backgroundImg from "../assets/profileBg.jpg";

const MyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${user?.id}`);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100%">
      <Box
        sx={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "white",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": {
            "&::after": {
              content: '""',
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              zIndex: 1,
            },
            "& .profileHoverText": {
              cursor: "pointer",
              display: "flex",
              zIndex: 2,
            },
          },
        }}
        onClick={handleProfileClick}
      >
        <Box
          sx={{
            mt: 2,
            width: 150,
            height: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            borderRadius: "50%",
          }}
        >
          {user?.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt="avatar"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          )}
        </Box>

        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "20px",
            p: 1,
            mt: 1,
            mb: 1,
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: 30, color: "white" }}>
            {user?.username}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "20px",
            p: 1,
          }}
        >
          <Typography sx={{ fontSize: 28, color: "white", mr: 1 }}>
            Currency: {user?.currency}
          </Typography>
          <Box
            component="img"
            src={currencyImg}
            alt="Currency"
            sx={{ width: 30, height: 30 }}
          />
        </Box>

        <Typography
          sx={{
            display: "none",
            fontWeight: "bold",
            fontSize: 35,
            color: "white",
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "20px",
            p: 2,
          }}
          className="profileHoverText"
        >
          View Profile
        </Typography>
      </Box>

      <Box bgcolor="red" flex={1} overflow="auto"></Box>
    </Box>
  );
};

export default MyProfile;
