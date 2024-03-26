import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import currencyImg from "../assets/currency.png";
import GroupIcon from "@mui/icons-material/Group";
import Friends from "./Friends";
import defaultAvatarImg from "../assets/defaultAvatar.png";
import defaultBackgroundImg from "../assets/defaultBackground.jpg";

const MyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${user?.id}`);
  };

  const backgroundStyle = {
    backgroundImage: user?.backgroundUrl
      ? `url(${user.backgroundUrl})`
      : `url(${defaultBackgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100%">
      <Box
        sx={{
          ...backgroundStyle,
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
              backdropFilter: "blur(2px)",
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
          <Box
            component="img"
            src={user?.avatarUrl || defaultAvatarImg}
            alt="avatar"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
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
            fontSize: 50,
            color: "white",
            position: "absolute",
            borderRadius: "20px",
            p: 2,
          }}
          className="profileHoverText"
        >
          View Profile
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: 24,
          fontWeight: "bold",
          color: "white",
          p: 1,
          pl: 2,
          backgroundColor: "#1450A3",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
        }}
      >
        <GroupIcon sx={{ marginRight: 1 }} />
        My Friends:
      </Box>

      <Friends />
    </Box>
  );
};

export default MyProfile;
