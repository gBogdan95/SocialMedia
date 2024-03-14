import React from "react";
import Box from "@mui/material/Box";
import { useAuth } from "../contexts/AuthContext";

const MyProfile = () => {
  const { user } = useAuth();

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100%">
      <Box
        bgcolor="blue"
        color="white"
        p={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        {user?.avatarUrl && (
          <img
            src={user.avatarUrl}
            alt="avatar"
            style={{ width: 100, height: 100, borderRadius: "50%" }}
          />
        )}
        <h3>Username: {user?.username}</h3>
        <h3>Currency: {user?.currency}</h3>
      </Box>

      <Box bgcolor="red" flex={1} overflow="auto"></Box>
    </Box>
  );
};

export default MyProfile;
