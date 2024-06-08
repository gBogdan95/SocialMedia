import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Paper, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";
import defaultAvatarImg from "../assets/defaultAvatar.png";
import defaultBackgroundImg from "../assets/defaultBackground.jpg";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MessageIcon from "@mui/icons-material/Message";
import Post, { PostType } from "../components/posts/Post";
import { postService } from "../services/postService";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import UpdateUserDetailsDialog from "../components/profile/UpdateUserDetailsDialog";
import { friendshipService } from "../services/friendshipService";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../components/common/ConfirmationDialog";
import ConversationMessages from "../components/conversations/ConversationMessages";
import GenericDialog from "../components/common/GenericDialog";
import UpdateAvatarDialog from "../components/profile/UpdateAvatarDialog";
import UpdateBackgroundDialog from "../components/profile/UpdateBackgroundDialog";

export interface ProfileDetailsType {
  id: string;
  username: string;
  name: string;
  description: string;
  phoneNumber: string;
  avatarUrl: string;
  backgroundUrl: string;
  email: string;
}

const ProfileDetails: React.FC = () => {
  const [profile, setProfile] = useState<ProfileDetailsType | null>(null);
  const [dialogInfo, setDialogInfo] = useState<{
    open: boolean;
    message: string;
    color: string;
  }>({
    open: false,
    message: "",
    color: "black",
  });
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();

  const isCurrentUser = user && profile && profile.id === user.id;

  const [userPosts, setUserPosts] = useState<PostType[]>([]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState("NONE");
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isBackgroundDialogOpen, setIsBackgroundDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleOpenConfirmation = () => setIsConfirmationOpen(true);
  const handleCloseConfirmation = () => setIsConfirmationOpen(false);

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleAvatarDialogClose = () => {
    setIsAvatarDialogOpen(false);
  };

  const handleBackgroundDialogClose = () => {
    setIsBackgroundDialogOpen(false);
  };

  const handleAddFriendClick = async () => {
    if (!userId) return;
    try {
      const userDetails = await userService.fetchUserById(userId);
      await friendshipService.sendFriendRequest(userDetails.username);
      setDialogInfo({
        open: true,
        message: "Your friend request has been sent successfully.",
        color: "black",
      });
    } catch (error) {
      console.error("Failed to send friend request:", error);
      let message = "Failed to send friend request.";
      let color = "red";
      if (error instanceof Error) {
        if (
          error.message.includes(
            "This user doesn't allow receiving friend requests"
          )
        ) {
          message = "This user doesn't allow receiving friend requests.";
        } else if (error.message.includes("Friend request already sent")) {
          message = "This friend request is pending.";
        } else {
        }
      }
      setDialogInfo({ open: true, message, color });
    }
  };

  const handleDeleteFriendClick = async () => {
    if (!userId) return;
    try {
      await friendshipService.removeFriend(userId);
      setFriendshipStatus("NONE");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting the friend:", error);
    }
  };

  const handleCloseDialog = () => setDialogInfo({ ...dialogInfo, open: false });

  useEffect(() => {
    const fetchProfileAndFriendshipStatus = async () => {
      if (userId) {
        try {
          const profileData = await userService.fetchUserById(userId);
          setProfile(profileData);

          const status = await friendshipService.checkFriendshipStatus(userId);
          setFriendshipStatus(status);
          console.log(status);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };

    fetchProfileAndFriendshipStatus();
  }, [userId]);

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
    <Box sx={{ maxWidth: "98%", ml: 0.5, mr: 3, position: "relative" }}>
      {isCurrentUser && (
        <IconButton
          sx={{
            position: "absolute",
            top: "15px",
            right: "30px",
            color: "lightgrey",
            zIndex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            borderRadius: "50px",
            "&:hover": {
              backgroundColor: "black",
            },
          }}
          onClick={() => setIsBackgroundDialogOpen(true)}
          aria-label="edit background"
        >
          <EditIcon
            sx={{
              fontSize: "60px",
              "&:hover": {
                color: "white",
              },
            }}
          />
        </IconButton>
      )}
      <UpdateBackgroundDialog
        open={isBackgroundDialogOpen}
        onClose={handleBackgroundDialogClose}
      ></UpdateBackgroundDialog>
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
            position: "relative",
          }}
        >
          <Box
            onClick={() => setIsAvatarDialogOpen(true)}
            sx={{
              cursor: "pointer",
              width: 175,
              height: 175,
              ml: 2,
              position: "relative",
              bottom: "-50%",
              zIndex: 1,
              overflow: "hidden",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Avatar
              src={profile.avatarUrl || defaultAvatarImg}
              alt={profile.name}
              sx={{
                width: "100%",
                height: "100%",
              }}
            />
            {isHovered && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(2px)",
                  transition: "opacity 0.3s",
                  zIndex: 2,
                  borderRadius: "50%",
                }}
              >
                <Typography variant="h6">Change Avatar</Typography>
              </Box>
            )}
          </Box>
          <UpdateAvatarDialog
            open={isAvatarDialogOpen}
            onClose={handleAvatarDialogClose}
          ></UpdateAvatarDialog>
        </Box>
        <Box sx={{ pt: 12, pb: 2, px: 5, position: "relative" }}>
          <Typography
            variant="h4"
            gutterBottom
            style={{ fontWeight: "bold", marginTop: "10px" }}
          >
            {profile.username}
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            style={{ marginTop: "10px" }}
          >
            Email: {profile.email}
          </Typography>
          {profile.name && (
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ marginBottom: "10px" }}
            >
              Name: {profile.name}
            </Typography>
          )}
          {profile.description && (
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ wordWrap: "break-word", marginBottom: "10px" }}
            >
              Description: {profile.description}
            </Typography>
          )}
          {profile.phoneNumber && (
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ marginBottom: "10px" }}
            >
              Phone Number: {profile.phoneNumber}
            </Typography>
          )}
          {isCurrentUser && (
            <>
              <IconButton
                sx={{
                  position: "absolute",
                  top: "15px",
                  right: "30px",
                  color: "#40A2D8",
                  "&:hover": {
                    backgroundColor: "lightblue",
                  },
                }}
                onClick={() => setIsEditDialogOpen(true)}
                aria-label="edit profile"
              >
                <EditIcon
                  sx={{
                    fontSize: "60px",
                    "&:hover": {
                      color: "#1450A3",
                    },
                  }}
                />
              </IconButton>
              <UpdateUserDetailsDialog
                open={isEditDialogOpen}
                handleClose={handleEditDialogClose}
                profileId={profile.id}
                initialFormData={{
                  name: profile.name,
                  phoneNumber: profile.phoneNumber,
                  description: profile.description,
                }}
              />
            </>
          )}
        </Box>
      </Paper>
      {!isCurrentUser && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          {friendshipStatus === "ACCEPTED" ? (
            <Button
              variant="contained"
              color="error"
              onClick={handleOpenConfirmation}
              sx={{ width: "calc(50% - 8px)", maxWidth: "600px", mr: 1 }}
              startIcon={<DeleteIcon />}
            >
              Remove Friend
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddFriendClick}
              sx={{ width: "calc(50% - 8px)", maxWidth: "600px", mr: 1 }}
              startIcon={<PersonAddIcon />}
            >
              Add Friend
            </Button>
          )}
          <ConfirmationDialog
            open={isConfirmationOpen}
            title="Remove Friend"
            message="Are you sure you want to delete this friend?"
            onConfirm={handleDeleteFriendClick}
            onCancel={handleCloseConfirmation}
          />
          <GenericDialog
            open={dialogInfo.open}
            message={dialogInfo.message}
            color={dialogInfo.color}
            onClose={handleCloseDialog}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsMessageDialogOpen(true)}
            sx={{ width: "calc(50% - 8px)", maxWidth: "600px", ml: 1 }}
            startIcon={<MessageIcon />}
          >
            Message
          </Button>
          <ConversationMessages
            open={isMessageDialogOpen}
            onClose={() => setIsMessageDialogOpen(false)}
            participant={
              profile
                ? {
                    id: profile.id,
                    username: profile.username,
                    avatarUrl: profile.avatarUrl,
                  }
                : { id: "", username: "", avatarUrl: defaultAvatarImg }
            }
          />
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
          {userPosts.length === 0 ? (
            <Typography sx={{ fontSize: 30 }}>
              {isCurrentUser
                ? "You have no posts yet."
                : "This user has no posts yet."}
            </Typography>
          ) : (
            userPosts.map((post) => (
              <Post key={post.id} post={post} trimText={true} />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileDetails;
