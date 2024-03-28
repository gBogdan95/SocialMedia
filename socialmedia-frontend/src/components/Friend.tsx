import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import defaultAvatarImg from "../assets/defaultAvatar.png";
import defaultBackgroundImg from "../assets/defaultBackground.jpg";

export interface FriendType {
  id: string;
  username: string;
  avatarUrl?: string;
  backgroundUrl: string;
}

const Friend: React.FC<FriendType> = ({
  id,
  username,
  avatarUrl,
  backgroundUrl,
}) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${id}`);
  };

  return (
    <Box
      sx={{
        width: "95.8%",
        height: 80,
        backgroundImage: `url(${backgroundUrl || defaultBackgroundImg})`,
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        padding: 1,
        borderRadius: 1,
        border: 1,
        overflow: "hidden",
        boxShadow: 1,
        position: "relative",
        cursor: "pointer",
        "&:hover": {
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
          },
        },
      }}
      onClick={handleProfileClick}
    >
      <Avatar
        src={avatarUrl || defaultAvatarImg}
        sx={{
          width: 60,
          height: 60,
          position: "absolute",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "10px",
          p: 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          minWidth: 120,
          maxWidth: "calc(100% - 72px)",
          boxSizing: "border-box",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "18px",
            color: "white",
            textShadow: "1px 1px 2px black",
          }}
        >
          {username}
        </Typography>
      </Box>
    </Box>
  );
};

export default Friend;
