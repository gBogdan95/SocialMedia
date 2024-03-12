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
    <Box sx={{ pt: 3, pr: 3, pb: 3, pl: 0 }}>
      <Post
        post={post}
        refreshPosts={() => {}}
        trimText={false}
        isDetailPage={true}
      />
    </Box>
  );
};

export default PostDetails;
