import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { postService } from "../services/postService";
import Post, { PostType } from "../components/Post";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Comments from "./Comments";

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const commentsRef = useRef<HTMLDivElement>(null);

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

  const scrollToComments = () =>
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });

  if (!post) return <Typography>Loading post...</Typography>;

  return (
    <Box sx={{ pt: 3, pr: 3, pb: 3, pl: 0 }}>
      <Post
        post={post}
        refreshPosts={() => {}}
        trimText={false}
        isDetailPage={true}
        onCommentButtonClick={scrollToComments}
      />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {}}
          sx={{ width: "50%", maxWidth: "600px", mt: 2, mb: 2 }}
          startIcon={<ArrowDownwardIcon />}
        >
          Add Comment
        </Button>
      </Box>
      <Box
        ref={commentsRef}
        sx={{ mt: 2, backgroundColor: "#DFF5FF", p: 2, borderRadius: 5 }}
      >
        <Comments />
      </Box>
    </Box>
  );
};

export default PostDetails;
