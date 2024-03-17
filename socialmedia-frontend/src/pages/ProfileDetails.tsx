import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Container,
  Paper,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { userService } from "../services/userService";
import defaultAvatarImg from "../assets/defaultAvatar.png";
import defaultBackgroundImg from "../assets/defaultBackground.jpg";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MessageIcon from "@mui/icons-material/Message";
import Post, { PostType } from "../components/Post";
import { postService } from "../services/postService";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

export interface ProfileDetailsType {
  id: string;
  username: string;
  description: string;
  email: string;
  avatarUrl: string;
  backgroundUrl: string;
}

const ProfileDetails: React.FC = () => {
  const [profile, setProfile] = useState<ProfileDetailsType | null>(null);
  const { userId } = useParams<{ userId: string }>();

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isCurrentUser = currentUser && profile && profile.id === currentUser.id;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        try {
          const profileData = await userService.fetchUserById(userId);
          setProfile(profileData);
        } catch (error) {
          console.error("Failed to fetch profile details:", error);
        }
      }
    };

    fetchProfile();
  }, [userId]);

  const [userPosts, setUserPosts] = useState<PostType[]>([]);

  const fetchAndSetUserPosts = async () => {
    if (!userId) return;

    try {
      const data = await postService.fetchPostsByUserId(userId);
      setUserPosts(data);
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
    }
  };

  useEffect(() => {
    fetchAndSetUserPosts();
  }, [userId]);

  if (!profile) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: "98%", ml: 0.5, mr: 3 }}>
      <Paper elevation={5} sx={{ mt: 2, borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            backgroundImage: `url(${profile.backgroundUrl || defaultBackgroundImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: 200,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Avatar
            src={profile.avatarUrl || defaultAvatarImg}
            alt={profile.username}
            sx={{
              width: 175,
              height: 175,
              ml: 2,
              transform: "translateY(50%)",
            }}
          />
        </Box>
        <Box sx={{ pt: 12, pb: 2, px: 5, position: "relative" }}>
          {" "}
          {/* Adjust the styling as needed */}
          <Typography variant="h4" gutterBottom style={{ fontWeight: "bold" }}>
            {profile.username}
          </Typography>
          {profile.description && (
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ wordWrap: "break-word", marginBottom: "10px" }}
            >
              Description: {profile.description}
            </Typography>
          )}
          <Typography variant="body1">Email: {profile.email}</Typography>
          {isCurrentUser && (
            <IconButton
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                color: open ? "#1450A3" : "#40A2D8",
                "&:hover": {
                  backgroundColor: "lightblue",
                },
                fontSize: "2rem",
              }}
              onClick={() => {}}
              aria-label="edit profile"
            >
              <EditIcon sx={{ fontSize: "inherit" }} />
            </IconButton>
          )}
        </Box>
      </Paper>
      {!isCurrentUser && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {}}
            sx={{ width: "calc(50% - 8px)", maxWidth: "600px", mr: 1 }}
            startIcon={<PersonAddIcon />}
          >
            Add Friend
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {}}
            sx={{ width: "calc(50% - 8px)", maxWidth: "600px", ml: 1 }}
            startIcon={<MessageIcon />}
          >
            Message
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 2, backgroundColor: "#DFF5FF", p: 2, borderRadius: 5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 3,
          }}
        >
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <Post key={post.id} post={post} trimText={true} />
            ))
          ) : (
            <Typography sx={{ fontSize: 30 }}>
              This user has no posts yet
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileDetails;
