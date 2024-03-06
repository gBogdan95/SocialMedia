import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export interface PostType {
  id: string;
  user: any;
  text: string;
  likes: number;
}

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <Box
      onClick={handlePostClick}
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
          backgroundColor: "rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <Typography variant="subtitle1" component="p" sx={{ fontWeight: "bold" }}>
        {post.user.username}
      </Typography>
      <Typography variant="body1" component="p">
        {post.text}
      </Typography>
      <Typography variant="body2" component="p">
        Likes: {post.likes}
      </Typography>
    </Box>
  );
};

export default Post;
