import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { postService } from "../services/postService";
import Post, { PostType } from "../components/Post";
const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostType | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const fetchedPost = await postService.fetchPostById(id);
          setPost(fetchedPost);
        } catch (error) {
          console.error("Failed to fetch post", error);
        }
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <Typography>Loading post...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Post post={post} trimText={false} refreshPosts={() => {}} />
    </Box>
  );
};

export default PostDetails;
