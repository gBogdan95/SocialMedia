import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { postService } from "../services/postService";

export interface PostType {
  id: string;
  user: any;
  text: string;
  likes: number;
  liked: boolean;
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

  const handlePostClick = () => {
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
        wordBreak: "break-word",
        marginBottom: 2,
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        transition: "background-color 0.3s",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <Typography variant="subtitle1" component="p" sx={{ fontWeight: "bold" }}>
        {post.user.username}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        onClick={handlePostClick}
        sx={{ mb: 2, cursor: "pointer" }}
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
          <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
            {likes}
          </Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Post;
