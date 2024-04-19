import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import Post, { PostType } from "../components/Post";
import Comment, { CommentType } from "../components/Comment";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CreateCommentDialog from "../components/CreateCommentDialog";
import { postService } from "../services/postService";
import { commentService } from "../services/commentService";
import { userService } from "../services/userService";
import { useUser } from "../contexts/UserContext";

const PostDetails: React.FC = () => {
  const { userDetails, setUserDetails } = useUser();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [commentAdded, setCommentAdded] = useState(false);

  const handleAddCommentClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateComment = async (content: string) => {
    if (!id || !userDetails) return;
    try {
      const newComment = await commentService.createComment(id, content);
      setComments((prevComments) => [...prevComments, newComment]);
      setCommentAdded(true);

      const updatedUserData = await userService.fetchUserById(userDetails.id);
      setUserDetails(updatedUserData);

      handleCloseCreateDialog();
    } catch (error) {
      console.error("Failed to create comment", error);
    }
  };

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

  useEffect(() => {
    if (commentAdded) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setCommentAdded(false);
    }
  }, [commentAdded]);

  if (!post) return <Typography>Loading post...</Typography>;

  return (
    <Box sx={{ pt: 3, pr: 3, pb: 3, pl: 0 }}>
      <Post post={post} trimText={false} isDetailPage={true} />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCommentClick}
          sx={{ width: "50%", maxWidth: "600px", mt: 2, mb: 2 }}
          startIcon={<AddBoxIcon />}
        >
          Add Comment
        </Button>
        <CreateCommentDialog
          open={createDialogOpen}
          onClose={handleCloseCreateDialog}
          onSave={handleCreateComment}
        />
      </Box>
      <Box sx={{ mt: 2, backgroundColor: "#DFF5FF", p: 2, borderRadius: 5 }}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment} trimText={true} />
          ))
        ) : (
          <Typography sx={{ textAlign: "center", fontSize: 30 }}>
            This post has no comments yet.
          </Typography>
        )}
      </Box>
      <div ref={bottomRef} />
    </Box>
  );
};

export default PostDetails;
