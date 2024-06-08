import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import FriendRequestNotification from "../components/notifications/FriendRequestNotification";
import { friendshipService } from "../services/friendshipService";

interface FriendRequest {
  id: string;
  requester: {
    id: string;
    username: string;
    avatarUrl?: string | null;
  };
  status: string;
}

const NotificationsPage = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFriendRequests = async () => {
      setLoading(true);
      try {
        const data = await friendshipService.listPendingFriendRequests();
        setFriendRequests(data);
      } catch (error) {
        console.error("Failed to load friend requests:", error);
        setError("Failed to load friend requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAccept = async (friendRequestId: string) => {
    try {
      await friendshipService.acceptFriendRequest(friendRequestId);
      setFriendRequests(
        friendRequests.filter((request) => request.id !== friendRequestId)
      );
      window.location.reload();
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  const handleDecline = async (friendRequestId: string) => {
    try {
      await friendshipService.declineFriendRequest(friendRequestId);
      setFriendRequests(
        friendRequests.filter((request) => request.id !== friendRequestId)
      );
    } catch (error) {
      console.error("Failed to decline friend request:", error);
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      width="100%"
      overflow="auto"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: -0.1,
          mb: 5.7,
        }}
      >
        {friendRequests.length > 0 ? (
          friendRequests.map((request) => (
            <FriendRequestNotification
              key={request.id}
              requesterId={request.requester.id}
              username={request.requester.username}
              avatarUrl={request.requester.avatarUrl}
              onAccept={() => handleAccept(request.id)}
              onDecline={() => handleDecline(request.id)}
            />
          ))
        ) : (
          <Typography sx={{ fontSize: 30, mt: 50 }}>
            You don't have any notifications.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default NotificationsPage;
