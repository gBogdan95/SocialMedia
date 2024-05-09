import React from "react";
import { Box, Button, Typography, Avatar } from "@mui/material";
import defaultAvatarImg from "../assets/defaultAvatar.png";

interface FriendRequestNotificationProps {
  requesterId: string;
  username: string;
  avatarUrl?: string | null;
  onAccept: () => void;
  onDecline: () => void;
}

const FriendRequestNotification: React.FC<FriendRequestNotificationProps> = ({
  username,
  avatarUrl,
  onAccept,
  onDecline,
}) => {
  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid",
        borderRadius: "4px",
        width: "92.05%",
        backgroundColor: "#F5F7F8",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Avatar
          src={avatarUrl || defaultAvatarImg}
          alt={username}
          sx={{ mr: 2 }}
        />
        <Typography variant="subtitle1" sx={{ cursor: "default" }}>
          <span style={{ fontWeight: "bold" }}>{username}</span>
          {" sent you a friend request!"}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="success"
          onClick={onAccept}
          sx={{
            display: "flex",
            justifyContent: "center",
            mr: 2,
            width: "100px",
            color: "white",
            backgroundColor: "#40A2D8",
            ":hover": {
              backgroundColor: "#1450A3",
            },
          }}
        >
          Accept
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onDecline}
          sx={{
            display: "flex",
            justifyContent: "center",
            mr: 1,
            width: "100px",
            color: "white",
            backgroundColor: "#D24545",
            ":hover": {
              backgroundColor: "red",
            },
          }}
        >
          Decline
        </Button>
      </Box>
    </Box>
  );
};

export default FriendRequestNotification;
