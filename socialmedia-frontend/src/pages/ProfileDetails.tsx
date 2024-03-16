import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Container, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { userService } from "../services/userService";
import defaultAvatarImg from "../assets/defaultAvatar.png";
import defaultBackgroundImg from "../assets/defaultBackground.jpg";

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

  if (!profile) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <Container maxWidth="md">
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
              width: 120,
              height: 120,
              border: "4px solid white",
              transform: "translateY(50%)",
            }}
          />
        </Box>
        <Box sx={{ pt: 7, pb: 2, px: 2 }}>
          {" "}
          <Typography variant="h4" gutterBottom>
            {profile.username}
          </Typography>
          {profile.description && (
            <Typography variant="subtitle1" gutterBottom>
              Description: {profile.description}
            </Typography>
          )}
          <Typography variant="body1">{profile.email}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfileDetails;
