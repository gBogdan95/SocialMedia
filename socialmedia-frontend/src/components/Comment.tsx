import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Link,
  Popover,
  Button,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import defaultAvatarImg from "../assets/defaultAvatar.png";
import { commentService } from "../services/commentService";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateCommentDialog from "./UpdateCommentDialog";
import ConfirmationDialog from "./ConfirmationDialog";

export interface CommentType {
  id: string;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  text: string;
  likes: number;
  liked: boolean;
}

interface CommentProps {
  comment: CommentType;
  trimText?: boolean;
}

const Comment: React.FC<CommentProps> = ({ comment, trimText = false }) => {
  const [liked, setLiked] = useState(comment.liked);
  const [likes, setLikes] = useState(comment.likes);
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isCurrentUser = currentUser && comment.user.id === currentUser.id;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleOpenConfirmation = () => setIsConfirmationOpen(true);
  const handleCloseConfirmation = () => setIsConfirmationOpen(false);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (text: string) => {
    try {
      await commentService.updateComment(comment.id, text);
      setEditDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await commentService.deleteComment(comment.id);
      handleCloseConfirmation();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting comment:", error);
      handleCloseConfirmation();
    }
  };

  const toggleLike = async () => {
    if (liked) {
      try {
        await commentService.unlikeComment(comment.id);
        setLikes(Math.max(0, likes - 1));
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await commentService.likeComment(comment.id);
        setLikes(likes + 1);
      } catch (error) {
        console.error(error);
      }
    }
    setLiked(!liked);
  };

  const displayText =
    trimText && !isTextExpanded && comment.text.length > 300
      ? `${comment.text.substring(0, 300)}... `
      : comment.text;

  const handleShowMoreClick = () => {
    setIsTextExpanded(!isTextExpanded);
  };

  const parseTextToLinkElements = (text: string): React.ReactNode[] => {
    const urlRegex = /(\bhttps?:\/\/\S+)/gi;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    text.replace(urlRegex, (match, url, offset) => {
      const textBeforeUrl = text.substring(lastIndex, offset);
      if (textBeforeUrl) {
        elements.push(textBeforeUrl);
      }
      elements.push(
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0645AD" }}
        >
          {url}
        </a>
      );
      lastIndex = offset + match.length;
      return match;
    });

    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      elements.push(remainingText);
    }

    return elements;
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box
      sx={{
        marginBottom: 2,
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{ mr: 2, color: "black" }}
            src={comment.user.avatarUrl || defaultAvatarImg}
            alt="User Avatar"
          >
            {!comment.user.avatarUrl}
          </Avatar>
          <Typography
            variant="subtitle1"
            component="p"
            sx={{ fontSize: 25, cursor: "default" }}
          >
            {comment.user.username}
          </Typography>
        </Box>

        {isCurrentUser && (
          <Box>
            <IconButton
              aria-label="settings"
              onClick={handleSettingsClick}
              sx={{
                "&:hover": {
                  backgroundColor: "lightblue",
                },
                color: open ? "#1450A3" : "#40A2D8",
              }}
            >
              <SettingsIcon sx={{ fontSize: "45px" }} />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box sx={{ p: 2 }}>
                <Button
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 1,
                    width: "200px",
                    color: "white",
                    backgroundColor: "#40A2D8",
                    ":hover": {
                      backgroundColor: "#1450A3",
                    },
                  }}
                >
                  Edit
                </Button>
                <UpdateCommentDialog
                  open={editDialogOpen}
                  content={comment.text}
                  onClose={() => setEditDialogOpen(false)}
                  onSave={handleSaveEdit}
                />

                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleOpenConfirmation}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "200px",
                    color: "white",
                    backgroundColor: "#D24545",
                    ":hover": {
                      backgroundColor: "red",
                    },
                  }}
                >
                  Delete
                </Button>
                <ConfirmationDialog
                  open={isConfirmationOpen}
                  title="Delete Post"
                  message="Are you sure you want to delete this post?"
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCloseConfirmation}
                />
              </Box>
            </Popover>
          </Box>
        )}
      </Box>
      <Typography variant="body2" sx={{ mt: 2, mb: 1, fontSize: 20 }}>
        {parseTextToLinkElements(displayText)}
        {trimText && comment.text.length > 300 && !isTextExpanded && (
          <Link
            underline="none"
            component="button"
            variant="body2"
            onClick={handleShowMoreClick}
            sx={{
              color: "#757575",
              "&:hover": {
                color: "#40A2D8",
              },
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            Show more
          </Link>
        )}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={toggleLike} sx={{ marginRight: 1 }}>
          <ThumbUpIcon color={liked ? "primary" : "action"} />
        </IconButton>
        <Typography variant="body2">{likes}</Typography>
      </Box>
    </Box>
  );
};

export default Comment;
