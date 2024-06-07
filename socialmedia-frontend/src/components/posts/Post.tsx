import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Popover,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { postService } from "../../services/postService";
import UpdatePostDialog from "../../components/posts/UpdatePostDialog";
import ConfirmationDialog from "./../ConfirmationDialog";
import defaultAvatarImg from "../../assets/defaultAvatar.png";
import { parseTextToLinkElements } from "../../utils/utils";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { userService } from "../../services/userService";

export interface PostType {
  id: string;
  user: any;
  title: string;
  text: string;
  likes: number;
  liked: boolean;
  totalComments: number;
  imageUrl?: string;
}

interface PostProps {
  post: PostType;
  refreshPosts?: () => void;
  trimText?: boolean;
  isDetailPage?: boolean;
}

const Post: React.FC<PostProps> = ({
  post,
  trimText = false,
  isDetailPage = false,
}) => {
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useUser();
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  const { user: currentUser } = useAuth();
  const isCurrentUser = currentUser && post.user.id === currentUser.id;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleOpenConfirmation = () => setIsConfirmationOpen(true);
  const handleCloseConfirmation = () => setIsConfirmationOpen(false);

  const displayText =
    trimText && post.text.length > 400
      ? `${post.text.substring(0, 400)}...`
      : post.text;

  useEffect(() => {
    setLiked(post.liked);
  }, [post.liked]);

  const handleClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (
    title: string,
    text: string,
    imageUrl?: string | null
  ) => {
    try {
      await postService.updatePost(post.id, title, text, imageUrl);
      setEditDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update post", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await postService.deletePost(post.id);
      handleCloseConfirmation();
      navigate("/explore");
    } catch (error) {
      console.error("Error deleting post:", error);
      handleCloseConfirmation();
    }
  };

  const toggleLike = async () => {
    try {
      if (liked) {
        await postService.unlikePost(post.id);
        setLikes(Math.max(0, likes - 1));
        const updatedUserData = await userService.fetchUserById(
          userDetails!.id
        );
        setUserDetails(updatedUserData);
      } else {
        await postService.likePost(post.id);
        setLikes(likes + 1);
        const updatedUserData = await userService.fetchUserById(
          userDetails!.id
        );
        setUserDetails(updatedUserData);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling the like status:", error);
    }
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
        "&:hover": isDetailPage
          ? {}
          : {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{ mr: 2, color: "black" }}
            src={post.user.avatarUrl || defaultAvatarImg}
            alt="User Avatar"
          >
            {!post.user.avatarUrl}
          </Avatar>
          <Typography
            variant="subtitle1"
            component="p"
            sx={{ fontSize: 25, cursor: "default" }}
          >
            {post.user.username}
          </Typography>
        </Box>

        {isDetailPage && isCurrentUser && (
          <Box>
            <IconButton
              aria-label="settings"
              onClick={handleSettingsClick}
              sx={{
                color: open ? "#1450A3" : "#40A2D8",
              }}
            >
              <SettingsIcon sx={{ fontSize: "60px" }} />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box sx={{ p: 2 }}>
                <Button
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 1,
                    width: "200px",
                    color: "white",
                    backgroundColor: "#40A2D8",
                  }}
                >
                  Edit
                </Button>
                <UpdatePostDialog
                  open={editDialogOpen}
                  title={post.title}
                  content={post.text}
                  imageUrl={post.imageUrl}
                  onClose={() => setEditDialogOpen(false)}
                  onSave={handleSaveEdit}
                />

                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleOpenConfirmation}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "200px",
                    color: "white",
                    backgroundColor: "#D24545",
                  }}
                >
                  Delete
                </Button>
                <ConfirmationDialog
                  open={isConfirmationOpen}
                  title="Delete Post"
                  message="Are you sure you want to delete this post?"
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCloseConfirmation}
                />
              </Box>
            </Popover>
          </Box>
        )}
      </Box>
      <Typography
        variant="subtitle1"
        component="p"
        onClick={handleClick}
        sx={{
          mb: 1,
          cursor: isDetailPage ? "text" : "pointer",
          fontWeight: "bold",
          fontSize: 30,
        }}
      >
        {post.title}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        onClick={handleClick}
        sx={{
          mb: 2,
          cursor: isDetailPage ? "text" : "pointer",
          fontSize: 20,
          whiteSpace: "pre-wrap",
        }}
      >
        {parseTextToLinkElements(displayText).map((element, index) => (
          <React.Fragment key={index}>{element}</React.Fragment>
        ))}
      </Typography>
      {post.imageUrl && (
        <Box
          onClick={handleClick}
          component="img"
          src={post.imageUrl}
          alt="Post Image"
          sx={{
            width: "100%",
            maxHeight: "500px",
            objectFit: "cover",
            borderRadius: "4px",
            mb: 2,
            cursor: "pointer",
          }}
        />
      )}
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
