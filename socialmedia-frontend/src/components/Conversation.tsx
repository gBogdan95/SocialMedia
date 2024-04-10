import React, { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import ConversationDialog from "./ConversationDialog";
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
  otherParticipant,
  lastMessage,
}) => {
  const [open, setOpen] = useState(false);

  const handleConversationClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  const isReadFontWeight = lastMessage.read ? "normal" : "bold";
  const isReadColor = lastMessage.read ? "text.secondary" : "black";

  return (
    <>
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
              sx={{
                fontSize: 25,
                fontWeight: isReadFontWeight,
                color: isReadColor,
              }}
            >
              {lastMessage.text}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{
              fontSize: 16,
              fontWeight: isReadFontWeight,
              mr: 1.5,
              color: isReadColor,
            }}
          >
            {formatTime(lastMessage.sentAt)}
          </Typography>
        </Box>
      </Box>
      <ConversationDialog
        open={open}
        onClose={handleClose}
        participant={otherParticipant}
      />
    </>
  );
};

export default Conversation;
