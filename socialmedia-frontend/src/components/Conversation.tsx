import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import defaultAvatarImg from "../assets/defaultAvatar.png";

export interface ParticipantType {
  id: string;
  username: string;
  avatarUrl?: string;
}

export interface MessageType {
  id: string;
  conversationId: string;
  sender: ParticipantType;
  text: string;
  sentAt: string;
  read: boolean;
}

export interface ConversationType {
  conversationId: string;
  otherParticipant: ParticipantType;
  lastMessage: MessageType;
}

const Conversation: React.FC<ConversationType> = ({
  conversationId,
  otherParticipant,
  lastMessage,
}) => {
  const navigate = useNavigate();

  const handleConversationClick = () => {
    navigate(`/conversation/${conversationId}`);
  };

  const avatarUrl = otherParticipant.avatarUrl || defaultAvatarImg;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#F5F7F8",
        width: "100%",
        padding: 4,
        borderRadius: 1,
        border: 1,
        boxShadow: 1,
        overflow: "hidden",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
      onClick={handleConversationClick}
    >
      <Avatar
        src={avatarUrl}
        sx={{ width: 70, height: 70, marginRight: 3, ml: 2 }}
        alt={otherParticipant.username}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle1" noWrap sx={{ fontSize: 22 }}>
            {otherParticipant.username}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ fontSize: 25 }}
          >
            {lastMessage.text}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          sx={{ fontSize: 16, mr: 1.5 }}
        >
          {formatTime(lastMessage.sentAt)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Conversation;
