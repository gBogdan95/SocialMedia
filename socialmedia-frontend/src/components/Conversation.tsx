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

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#F5F7F8",
        width: "100%",
        padding: 3,
        borderRadius: 1,
        border: 1,
        boxShadow: 1,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
      onClick={handleConversationClick}
    >
      <Avatar
        src={avatarUrl}
        sx={{ width: 80, height: 80, marginRight: 5 }}
        alt={otherParticipant.username}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" noWrap sx={{ fontSize: 30 }}>
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
    </Box>
  );
};

export default Conversation;
