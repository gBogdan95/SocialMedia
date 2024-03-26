import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { postService } from "../services/postService";
import { commentService } from "../services/commentService";
import Post, { PostType } from "../components/Post";
import Comment, { CommentType } from "../components/Comment";
import AddBoxIcon from "@mui/icons-material/AddBox";

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (id) {
        try {
          const fetchedPost = await postService.fetchPostById(id);
          setPost(fetchedPost);
          const fetchedComments =
            await commentService.fetchCommentsByPostId(id);
          setComments(fetchedComments);
        } catch (error) {
          console.error("Failed to fetch post or comments", error);
        }
      }
    };

    fetchPostAndComments();
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
      <Box
        ref={commentsRef}
        sx={{ display: "flex", justifyContent: "center", mt: 2 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {}}
          sx={{ width: "50%", maxWidth: "600px", mt: 2, mb: 2 }}
          startIcon={<AddBoxIcon />}
        >
          Add Comment
        </Button>
      </Box>
      <Box sx={{ mt: 2, backgroundColor: "#DFF5FF", p: 2, borderRadius: 5 }}>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </Box>
    </Box>
  );
};

export default PostDetails;
