import React, { useEffect } from "react";
import { Box, Button, Typography, Checkbox } from "@mui/material";
import ChangeUsernameDialog from "../components/ChangeUsernameDialog";
import ChangeEmailDialog from "../components/ChangeEmailDialog";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import { settingsService } from "../services/settingsService";
import { userService } from "../services/userService";

const Settings: React.FC = () => {
  const [blockMessages, setBlockMessages] = React.useState(false);
  const [blockFriendRequests, setBlockFriendRequests] = React.useState(false);
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = React.useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = React.useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);

  const storedUserJSON = localStorage.getItem("user");
  const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;
  const userId = storedUser ? storedUser.id : null;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (userId) {
        try {
          const user = await userService.fetchUserById(userId);
          setBlockFriendRequests(!user.allowingFriendRequests);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchCurrentUser();
  }, [userId]);

  const handleBlockMessagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBlockMessages(event.target.checked);
  };

  const handleBlockFriendRequestsChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSetting = event.target.checked;
    setBlockFriendRequests(newSetting);
    try {
      const updatedUser = await settingsService.updateFriendRequestSetting(
        userId,
        !newSetting
      );
      setBlockFriendRequests(!updatedUser.allowingFriendRequests);
    } catch (error) {
      console.error("Failed to update friend request setting", error);
      setBlockFriendRequests(!newSetting);
    }
  };

  const toggleUsernameDialog = () => {
    setIsUsernameDialogOpen(!isUsernameDialogOpen);
  };

  const toggleEmailDialog = () => {
    setIsEmailDialogOpen(!isEmailDialogOpen);
  };

  const togglePasswordDialog = () => {
    setIsPasswordDialogOpen(!isPasswordDialogOpen);
  };

  if (!userId) {
    return <div>User ID not found!</div>;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{ mt: -4, mr: 6 }}
    >
      <Box width="100%" maxWidth={700}>
        <Typography
          variant="h6"
          sx={{
            fontSize: 25,
            bgcolor: "#1450A3",
            color: "common.white",
            cursor: "default",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
            py: 2.5,
            textAlign: "center",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          ACCOUNT
        </Typography>
        <Box sx={{ border: 1, borderColor: "black" }}>
          {["Change Username", "Change Password", "Change Email"].map(
            (text) => (
              <Button
                key={text}
                onClick={
                  text === "Change Username"
                    ? toggleUsernameDialog
                    : text === "Change Email"
                      ? toggleEmailDialog
                      : text === "Change Password"
                        ? togglePasswordDialog
                        : undefined
                }
                variant="text"
                fullWidth
                sx={{
                  fontSize: 20,
                  color: "text.primary",
                  py: 3,
                  borderColor: "black",
                  "&:not(:last-child)": {
                    borderBottom: 1,
                  },
                  "&:hover": {
                    bgcolor: "lightgrey",
                  },
                  bgcolor: "#F5F7F8",
                  borderRadius: 0,
                  boxShadow: "none",
                }}
              >
                {text}
              </Button>
            )
          )}
          <ChangeUsernameDialog
            userId={userId}
            open={isUsernameDialogOpen}
            onClose={toggleUsernameDialog}
          />
          <ChangeEmailDialog
            userId={userId}
            open={isEmailDialogOpen}
            onClose={toggleEmailDialog}
          />
          <ChangePasswordDialog
            userId={userId}
            open={isPasswordDialogOpen}
            onClose={togglePasswordDialog}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: 25,
            bgcolor: "#1450A3",
            color: "common.white",
            cursor: "default",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
            py: 2.5,
            textAlign: "center",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          PRIVACY
        </Typography>
        <Box
          sx={{
            border: 1,
            borderColor: "black",
            px: 3,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              ml: -1.7,
            }}
          >
            <Checkbox
              checked={blockMessages}
              onChange={handleBlockMessagesChange}
              name="blockMessages"
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: "2rem",
                },
              }}
            />
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: "bold",
                mr: 2,
                cursor: "default",
              }}
            >
              Block messages from non-friends
            </Typography>
          </Box>
          <Typography
            sx={{ fontSize: 16, wordBreak: "break-word", cursor: "default" }}
          >
            By selecting this option you will no longer receive messages from
            users that are not in your friendlist.
          </Typography>
        </Box>
        <Box
          sx={{
            border: 1,
            borderColor: "black",
            px: 3,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              ml: -1.7,
            }}
          >
            <Checkbox
              checked={blockFriendRequests}
              onChange={handleBlockFriendRequestsChange}
              name="blockFriendRequests"
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: "2rem",
                },
              }}
            />
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: "bold",
                mr: 2,
                cursor: "default",
              }}
            >
              Block friend requests
            </Typography>
          </Box>
          <Typography
            sx={{ fontSize: 16, wordBreak: "break-word", cursor: "default" }}
          >
            By selecting this option you will no longer receive friend requests.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
