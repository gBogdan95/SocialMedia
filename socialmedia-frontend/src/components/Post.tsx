import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Popover,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { postService } from "../services/postService";
import UpdatePostDialog from "./UpdatePostDialog";
import ConfirmationDialog from "./ConfirmationDialog";

export interface PostType {
  id: string;
  user: any;
  title: string;
  text: string;
  likes: number;
  liked: boolean;
  totalComments: number;
}

interface PostProps {
  post: PostType;
  refreshPosts: () => void;
  trimText?: boolean;
  isDetailPage?: boolean;
  onCommentButtonClick?: () => void;
}

const Post: React.FC<PostProps> = ({
  post,
  trimText = false,
  isDetailPage = false,
  onCommentButtonClick,
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isCurrentUser = currentUser && post.user.id === currentUser.id;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleOpenConfirmation = () => setIsConfirmationOpen(true);
  const handleCloseConfirmation = () => setIsConfirmationOpen(false);

  const displayText =
    trimText && post.text.length > 100
      ? `${post.text.substring(0, 400)}...`
      : post.text;

  useEffect(() => {
    setLiked(post.liked);
  }, [post.liked]);

  const handleClick = () => {
    if (isDetailPage && onCommentButtonClick) {
      onCommentButtonClick();
    } else {
      navigate(`/post/${post.id}`);
    }
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (title: string, text: string) => {
    try {
      await postService.updatePost(post.id, title, text);
      setEditDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update post", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await postService.deletePost(post.id);
      handleCloseConfirmation();
      navigate("/explore");
    } catch (error) {
      console.error("Error deleting post:", error);
      handleCloseConfirmation();
    }
  };

  const toggleLike = async () => {
    if (liked) {
      try {
        await postService.unlikePost(post.id);
        setLikes(Math.max(0, likes - 1));
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await postService.likePost(post.id);
        setLikes(likes + 1);
      } catch (error) {
        console.error(error);
      }
    }
    setLiked(!liked);
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
        maxWidth: "100%",
        minWidth: "95%",
        wordBreak: "break-word",
        marginBottom: 2,
        padding: 3.1,
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        transition: "background-color 0.3s",
        "&:hover": isDetailPage
          ? {}
          : {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            },
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
            src={post.user.avatarUrl ? post.user.avatarUrl : ""}
            alt="User Avatar"
          >
            {!post.user.avatarUrl && <PersonIcon />}
          </Avatar>
          <Typography
            variant="subtitle1"
            component="p"
            sx={{ fontSize: 25, cursor: "default" }}
          >
            {post.user.username}
          </Typography>
        </Box>

        {isDetailPage && isCurrentUser && (
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
              <SettingsIcon sx={{ fontSize: "60px" }} />
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
                <UpdatePostDialog
                  open={editDialogOpen}
                  title={post.title}
                  text={post.text}
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
      <Typography
        variant="subtitle1"
        component="p"
        onClick={handleClick}
        sx={{
          mb: 1,
          cursor: isDetailPage ? "text" : "pointer",
          fontWeight: "bold",
          fontSize: 30,
        }}
      >
        {post.title}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        onClick={handleClick}
        sx={{
          mb: 2,
          cursor: isDetailPage ? "text" : "pointer",
          fontSize: 20,
        }}
      >
        {displayText}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <IconButton
          aria-label="like post"
          onClick={toggleLike}
          sx={{
            mr: 1,
            borderRadius: "15px",
            padding: "12px",
            "&:hover": {
              backgroundColor: "lightblue",
            },
          }}
        >
          <ThumbUpIcon
            color={liked ? "primary" : "action"}
            sx={{ fontSize: "28px" }}
          />
          <Typography variant="body2" sx={{ marginLeft: 0.5, fontSize: 20 }}>
            {likes}
          </Typography>
        </IconButton>
        <IconButton
          aria-label="comment on post"
          onClick={handleClick}
          sx={{
            mr: 1,
            borderRadius: "15px",
            padding: "12px",
            "&:hover": {
              backgroundColor: "lightblue",
            },
          }}
        >
          <ChatBubbleIcon sx={{ fontSize: "28px" }} />
          <Typography variant="body2" sx={{ marginLeft: 0.5, fontSize: 20 }}>
            {post.totalComments}
          </Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Post;
