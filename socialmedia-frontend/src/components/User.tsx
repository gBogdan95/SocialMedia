import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

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
  return (
    <Box
      sx={{
        width: "100%",
        height: 150,
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        padding: 1,
        borderRadius: 1,
        overflow: "hidden",
        marginBottom: 1,
        boxShadow: 1,
        position: "relative",
      }}
    >
      <Avatar
        src={avatarUrl}
        sx={{
          width: 100,
          height: 100,
          border: "2px solid white",
          position: "absolute",
          left: 50,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: "white",
          marginLeft: `calc(64px + 300px)`,
          textShadow: "1px 1px 2px black",
          fontSize: 70,
        }}
      >
        {username}
      </Typography>
    </Box>
  );
};

export default User;
