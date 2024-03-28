import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import FriendRequestNotification from "../components/FriendRequestNotification";
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

  const handleAccept = async (friendRequestId: string) => {};

  const handleDecline = async (friendRequestId: string) => {};

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
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
        <Typography>No new notifications</Typography>
      )}
    </Box>
  );
};

export default NotificationsPage;
