import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
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
}

const Post: React.FC<PostProps> = ({ post }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  useEffect(() => {
    setLiked(post.liked);
  }, [post.liked]);

  const handleClick = () => {
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
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <Typography variant="subtitle1" component="p" sx={{ fontSize: 25 }}>
        {post.user.username}
      </Typography>
      <Typography
        variant="subtitle1"
        component="p"
        sx={{ fontWeight: "bold", fontSize: 30, mb: 1 }}
      >
        {post.title}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        onClick={handleClick}
        sx={{ mb: 2, cursor: "pointer", fontSize: 20 }}
      >
        {post.text}
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
