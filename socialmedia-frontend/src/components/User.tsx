import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import defaultAvatarImg from "../assets/defaultAvatar.png";
import defaultBackgroundImg from "../assets/defaultBackground.jpg";

export interface UserType {
  id: string;
  username: string;
  avatarUrl: string;
  backgroundUrl: string;
}

const User: React.FC<UserType> = ({ username, avatarUrl, backgroundUrl }) => {
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
      }}
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
    </Box>
  );
};

export default User;
