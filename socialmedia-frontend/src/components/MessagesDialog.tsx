import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Box, Typography, Avatar } from "@mui/material";
import { messageService } from "../services/messageService";

export interface MessageType {
  id: string;
  conversationId: string;
  sender: ParticipantType;
  text: string;
  sentAt: string;
  read: boolean;
}

export interface ParticipantType {
  id: string;
  username: string;
  avatarUrl?: string;
}

interface MessagesDialogProps {
  open: boolean;
  onClose: () => void;
  conversationId: string;
  currentUserId: string;
}

const MessagesDialog: React.FC<MessagesDialogProps> = ({
  open,
  onClose,
  conversationId,
  currentUserId,
}) => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (open) {
      const fetchMessages = async () => {
        try {
          const data = await messageService.getMessages(conversationId);
          setMessages(data);
        } catch (error) {
          console.error("Failed to load messages:", error);
        }
      };

      fetchMessages();
    }
  }, [open, conversationId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        {messages.map((message) => {
          const isSender = message.sender.id === currentUserId;
          return (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent: isSender ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  maxWidth: "70%",
                  backgroundColor: isSender ? "#DCF8C6" : "#FFFFFF",
                  padding: 1,
                  borderRadius: "10px",
                  boxShadow: 1,
                }}
              >
                <Typography variant="body1" color="textPrimary">
                  {message.text}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(message.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default MessagesDialog;
