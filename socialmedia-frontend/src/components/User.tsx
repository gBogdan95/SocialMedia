import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import defaultAvatarImg from "../assets/defaultAvatar.png";
import defaultBackgroundImg from "../assets/defaultBackground.jpg";

export interface UserType {
  id: string;
  username: string;
  avatarUrl: string;
  backgroundUrl: string;
}

const User: React.FC<UserType> = ({
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
        width: "98%",
        height: 150,
        backgroundImage: `url(${backgroundUrl || defaultBackgroundImg})`,
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 1,
        borderRadius: 5,
        overflow: "hidden",
        marginBottom: 2.5,
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
          "& .viewProfileText": {
            display: "flex",
            zIndex: 2,
          },
        },
      }}
      onClick={handleProfileClick}
    >
      <Avatar
        src={avatarUrl || defaultAvatarImg}
        sx={{
          width: 125,
          height: 125,
          position: "absolute",
          left: 50,
          top: "50%",
          transform: "translateY(-50%)",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          borderRadius: "50%",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "20px",
          p: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          width: "auto",
          minWidth: 250,
          maxWidth: "90%",
          boxSizing: "border-box",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "50px",
            color: "white",
            textShadow: "1px 1px 2px black",
          }}
        >
          {username}
        </Typography>
      </Box>
      <Typography
        sx={{
          display: "none",
          fontWeight: "bold",
          fontSize: "60px",
          color: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          backgroundColor: "rgba(0, 0, 0, 1)",
          borderRadius: "20px",
          padding: "10px 20px",
          textShadow: "1px 1px 2px black",
        }}
        className="viewProfileText"
      >
        View Profile
      </Typography>
    </Box>
  );
};

export default User;
