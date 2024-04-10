import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  Avatar,
  Box,
  CircularProgress,
  Typography,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import defaultAvatarImg from "../assets/defaultAvatar.png";
import { messageService } from "../services/messageService";
import { getCurrentUsername, formatTime } from "../utils/utils";

export interface ParticipantType {
  id: string;
  username: string;
  avatarUrl?: string;
}

interface ConversationDialogProps {
  open: boolean;
  onClose: () => void;
  participant: ParticipantType;
}

interface SenderType {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  currency?: number;
  name?: string;
  phoneNumber?: string;
  description?: string;
}

interface MessageType {
  id: string;
  conversationId: string;
  sender: SenderType;
  text: string;
  sentAt: string;
  read: boolean;
}

const ConversationDialog: React.FC<ConversationDialogProps> = ({
  open,
  onClose,
  participant,
}) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUserUsername = getCurrentUsername();

  useEffect(() => {
    if (open) {
      setLoading(true);
      messageService
        .getMessages(participant.username)
        .then((messages: MessageType[]) => {
          setMessages(messages);
          setLoading(false);
        })
        .catch((error: Error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [open, participant.username]);

  const renderMessages = () => {
    if (loading) {
      return <CircularProgress />;
    }
    if (error) {
      return <Typography color="error">{error}</Typography>;
    }
    return (
      <List
        sx={{
          minHeight: 500,
          maxHeight: 500,
          overflowY: "auto",
          bgcolor: "background.paper",
        }}
      >
        {messages.map((message, index) => (
          <ListItem
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                message.sender.username === currentUserUsername
                  ? "flex-end"
                  : "flex-start",
              flexDirection: "column",
              alignItems:
                message.sender.username === currentUserUsername
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                backgroundColor:
                  message.sender.username === currentUserUsername
                    ? "#bbdefb"
                    : "#e0f2f1",
                borderRadius: 1,
                padding: "8px 12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <Typography
                variant="body1"
                sx={{ wordBreak: "break-word", flexGrow: 1 }}
              >
                {message.text}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  marginLeft: 2,
                  whiteSpace: "nowrap",
                  fontSize: "0.775rem",
                  paddingLeft: "8px",
                }}
              >
                {formatTime(message.sentAt)}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#1450A3",
          padding: 1.5,
          color: "white",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
          fontSize: 24,
          fontWeight: "bold",
          position: "relative",
        }}
      >
        <Avatar
          src={participant.avatarUrl || defaultAvatarImg}
          alt={participant.username}
          sx={{
            mr: 2.5,
            ml: 1,
            width: 50,
            height: 50,
          }}
        />
        <Box sx={{ flex: 1, textAlign: "left" }}>{participant.username}</Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 25,
            top: "50%",
            transform: "translateY(-50%)",
            color: "white",
          }}
        >
          <CloseIcon sx={{ width: 35, height: 35 }} />
        </IconButton>
      </DialogTitle>
      {renderMessages()}
    </Dialog>
  );
};

export default ConversationDialog;