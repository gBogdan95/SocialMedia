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
    <Container sx={{ maxWidth: "100%" }}>
      <Paper elevation={3} sx={{ mt: 2, borderRadius: 2, overflow: "hidden" }}>
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
        <Box sx={{ pt: 12, pb: 2, px: 5 }}>
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
      <Box
        sx={{
          marginTop: 2.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <Post key={post.id} post={post} trimText={true} />
          ))
        ) : (
          <Typography>This user has no posts yet</Typography>
        )}
      </Box>
    </Container>
  );
};

export default ProfileDetails;
