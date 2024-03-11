import React, { useState, useEffect } from "react";
import Post, { PostType } from "../components/Post";
import { Box, Typography } from "@mui/material";
import { postService } from "../services/postService";

const ExplorePage = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  const fetchAndSetPosts = async () => {
    try {
      const data = await postService.fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAndSetPosts();
  }, []);

  const refreshPosts = () => {
    fetchAndSetPosts();
  };

  return (
    <Box
      sx={{
        marginTop: 2.5,
        marginRight: 2.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post.id} post={post} refreshPosts={refreshPosts} />
        ))
      ) : (
        <Typography>No posts to display</Typography>
      )}
    </Box>
  );
};

export default ExplorePage;
