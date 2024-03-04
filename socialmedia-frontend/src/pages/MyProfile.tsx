import React from "react";
import Box from "@mui/material/Box";
import { useAuth } from "../contexts/AuthContext";

const MyProfile = () => {
  const { user } = useAuth();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      width="100%"
    >
      <h3>Username: {user?.username}</h3>
    </Box>
  );
};

export default MyProfile;
