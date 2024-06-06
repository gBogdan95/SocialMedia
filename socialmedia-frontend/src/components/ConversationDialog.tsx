import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  Avatar,
  Box,
  CircularProgress,
  Typography,
  List,
  ListItem,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import defaultAvatarImg from "../assets/defaultAvatar.png";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteIcon from "@mui/icons-material/Delete";
import { messageService } from "../services/messageService";
import { getCurrentUsername, formatTime } from "../utils/utils";
import GenericDialog from "../components/GenericDialog";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { postService } from "../services/postService";
import ConfirmationDialog from "./ConfirmationDialog";

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
  imageUrl?: string | null;
  sentAt: string;
  read: boolean;
}

const ConversationDialog: React.FC<ConversationDialogProps> = ({
  open,
  onClose,
  participant,
}) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageText, setMessageText] = useState("");
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [dialogInfo, setDialogInfo] = useState({
    open: false,
    message: "",
    color: "black",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserUsername = getCurrentUsername();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
          if (error.message.includes("Conversation not found!")) {
            setMessages([]);
            setError("");
          } else {
            setError(error.message);
          }
          setLoading(false);
        });
    }
  }, [open, participant.username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (
    textToSend: string = "",
    imageUrlToSend: string | null = null
  ) => {
    if (!imageUrlToSend && !textToSend.trim()) {
      console.log("No message to send");
      return;
    }

    try {
      const sentMessage = await messageService.sendMessage(
        participant.username,
        textToSend.trim(),
        imageUrlToSend
      );
      console.log("Message sent successfully:", sentMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...sentMessage, text: textToSend.trim(), imageUrl: imageUrlToSend },
      ]);

      if (textToSend.trim()) {
        setMessageText("");
      }
      if (imageUrlToSend) {
        setImageUrl(null);
      }
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
      setDialogInfo({
        open: true,
        message: "User doesn't allow receiving messages from non-friends.",
        color: "red",
      });
    }
  };

  const handleOpenDeleteDialog = (messageId: string) => {
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteMessage = async () => {
    if (messageToDelete) {
      try {
        await messageService.deleteMessage(messageToDelete);
        setMessages((prevMessages) =>
          prevMessages.filter((m) => m.id !== messageToDelete)
        );
        setDeleteDialogOpen(false);
        setMessageToDelete(null);
      } catch (error) {
        console.error("Error deleting message:", error);
        setDialogInfo({
          open: true,
          message: "Failed to delete message.",
          color: "red",
        });
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setMessageToDelete(null);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const uploadedImageUrl = await postService.uploadImage(files[0]);
        await handleSendMessage("", uploadedImageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        setDialogInfo({
          open: true,
          message: "Failed to upload image.",
          color: "red",
        });
      }
    }
  };

  const handleCloseDialog = () => setDialogInfo({ ...dialogInfo, open: false });

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
            onMouseEnter={() => setHoveredMessage(message.id)}
            onMouseLeave={() => setHoveredMessage(null)}
          >
            <Box
              sx={{
                maxWidth: "70%",
                backgroundColor:
                  message.sender.username === currentUserUsername
                    ? "#bbdefb"
                    : "#e0f2f1",
                borderRadius: 1,
                padding: 1,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems:
                  message.sender.username === currentUserUsername
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "8px",
              }}
            >
              {message.imageUrl && (
                <Box
                  component="img"
                  src={message.imageUrl}
                  onLoad={scrollToBottom}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                  alt="Attached Image"
                />
              )}
              {message.text && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    flexGrow: 1,
                  }}
                >
                  <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                    {message.text}
                  </Typography>
                  {message.text.length <= 60 && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.775rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatTime(message.sentAt)}
                      </Typography>
                      {message.sender.username === currentUserUsername && (
                        <DoneAllIcon
                          sx={{
                            fontSize: "1.2rem",
                            color: message.read
                              ? "primary.main"
                              : "text.secondary",
                            ml: 0.5,
                          }}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              )}
              {message.text.length > 60 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.775rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatTime(message.sentAt)}
                  </Typography>
                  {message.sender.username === currentUserUsername && (
                    <DoneAllIcon
                      sx={{
                        fontSize: "1.2rem",
                        color: message.read ? "primary.main" : "text.secondary",
                        ml: 0.5,
                      }}
                    />
                  )}
                </Box>
              )}
              {!message.text && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "10px",
                    padding: "2px 6px",
                    color: "white",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.775rem",
                    }}
                  >
                    {formatTime(message.sentAt)}
                  </Typography>
                  {message.sender.username === currentUserUsername && (
                    <DoneAllIcon
                      sx={{
                        fontSize: "1.2rem",
                        ml: 1,
                        color: message.read ? "primary.main" : "white",
                      }}
                    />
                  )}
                </Box>
              )}
              {hoveredMessage === message.id &&
                message.sender.username === currentUserUsername && (
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "red",
                    }}
                    onClick={() => handleOpenDeleteDialog(message.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
            </Box>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
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
      <Box sx={{ position: "relative", padding: 2 }}>
        <TextField
          multiline
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          minRows={1}
          maxRows={8}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(messageText);
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              paddingLeft: "50px",
              paddingRight: "50px",
            },
            "& .MuiOutlinedInput-input": {
              paddingRight: "0 !important",
              paddingLeft: "0 !important",
            },
            "& .MuiOutlinedInput-multiline": {
              paddingRight: "0 !important",
              paddingLeft: "0 !important",
            },
          }}
        />
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={() => document.getElementById("image-upload-input")?.click()}
          sx={{
            position: "absolute",
            left: 20,
            bottom: 22,
            color: "primary.main",
          }}
        >
          <AddPhotoAlternateIcon sx={{ width: 30, height: 30 }} />
        </IconButton>
        <IconButton
          onClick={() => handleSendMessage(messageText)}
          sx={{
            position: "absolute",
            right: 20,
            bottom: 22,
            color: "primary.main",
          }}
        >
          <SendIcon sx={{ width: 30, height: 30 }} />
        </IconButton>
        <input
          type="file"
          id="image-upload-input"
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/*"
        />
        <GenericDialog
          open={dialogInfo.open}
          message={dialogInfo.message}
          color={dialogInfo.color}
          onClose={handleCloseDialog}
        />
      </Box>
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete message"
        message="Are you sure you want to delete this message?"
        onConfirm={handleDeleteMessage}
        onCancel={handleCancelDelete}
      />
    </Dialog>
  );
};

export default ConversationDialog;
