import React, { useState } from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import defaultAvatarImg from "../assets/defaultAvatar.png";

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
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [liked, setLiked] = useState(comment.liked);
  const [likes, setLikes] = useState(comment.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

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
      <Typography variant="body2" sx={{ mt: 2, mb: 1, fontSize: 20 }}>
        {comment.text}
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
