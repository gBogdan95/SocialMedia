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
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import defaultAvatarImg from "../assets/defaultAvatar.png";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { messageService } from "../services/messageService";
import { getCurrentUsername, formatTime } from "../utils/utils";
import GenericDialog from "../components/GenericDialog";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { postService } from "../services/postService";

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
  const [dialogInfo, setDialogInfo] = useState({
    open: false,
    message: "",
    color: "black",
  });

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
          if (
            error.message.includes(
              "No conversation found between the specified users."
            )
          ) {
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

  const handleSendMessage = async (imageUrlToSend: string | null = null) => {
    // Use imageUrlToSend if provided, otherwise fall back to state imageUrl
    const finalImageUrl = imageUrlToSend || imageUrl;

    if (!finalImageUrl && messageText.trim() === "") {
      console.log("No message to send");
      return;
    }

    try {
      const sentMessage = await messageService.sendMessage(
        participant.username,
        messageText,
        finalImageUrl
      );
      console.log("Message sent successfully:", sentMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...sentMessage, imageUrl: finalImageUrl },
      ]);

      setMessageText("");
      setImageUrl(null); // Clear the imageUrl state only if not provided directly
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
      setDialogInfo({
        open: true,
        message: "Failed to send message.",
        color: "red",
      });
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const uploadedImageUrl = await postService.uploadImage(files[0]);
        console.log("Uploaded image URL:", uploadedImageUrl);
        handleSendMessage(uploadedImageUrl); // Directly pass the URL to handleSendMessage
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
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              {message.imageUrl && (
                <Box
                  component="img"
                  src={message.imageUrl}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                    marginRight: 2,
                  }}
                  alt="Attached Image"
                />
              )}
              <Typography
                variant="body1"
                sx={{ wordBreak: "break-word", flexGrow: 1, marginRight: 1 }}
              >
                {message.text}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="caption"
                  sx={{
                    whiteSpace: "nowrap",
                    fontSize: "0.775rem",
                  }}
                >
                  {formatTime(message.sentAt)}
                </Typography>
                {message.sender.username === currentUserUsername && (
                  <DoneAllIcon
                    sx={{
                      fontSize: "1.2rem",
                      color: message.read ? "primary.main" : "text.secondary",
                      marginLeft: 1,
                    }}
                  />
                )}
              </Box>
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
              handleSendMessage();
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              paddingRight: "50px",
            },
            "& .MuiOutlinedInput-input": {
              paddingRight: "0 !important",
            },
            "& .MuiOutlinedInput-multiline": {
              paddingRight: "48px !important",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={() =>
                    document.getElementById("image-upload-input")?.click()
                  }
                  sx={{ marginRight: 1 }}
                >
                  <AddPhotoAlternateIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleSendMessage()}
                  sx={{
                    position: "absolute",
                    right: 2,
                    bottom: 8,
                    color: "primary.main",
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
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
    </Dialog>
  );
};

export default ConversationDialog;
