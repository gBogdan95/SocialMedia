import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Popover,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import SettingsIcon from "@mui/icons-material/Settings";
import { postService } from "../services/postService";

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
}

const Post: React.FC<PostProps> = ({
  post,
  trimText = false,
  isDetailPage = false,
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isCurrentUser = currentUser && post.user.id === currentUser.id;

  const displayText =
    trimText && post.text.length > 100
      ? `${post.text.substring(0, 400)}...`
      : post.text;

  useEffect(() => {
    setLiked(post.liked);
  }, [post.liked]);

  const handleClick = isDetailPage
    ? undefined
    : () => {
        navigate(`/post/${post.id}`);
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
          <Avatar sx={{ mr: 2, color: "black" }}>
            <PersonIcon />
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
                <Button sx={{ display: "block", mb: 1 }} onClick={() => {}}>
                  Edit
                </Button>
                <Button sx={{ display: "block", mb: 1 }} onClick={() => {}}>
                  Delete
                </Button>
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
