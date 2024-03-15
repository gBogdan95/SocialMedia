import React, { useState, useEffect } from "react";
import User, { UserType } from "../components/User";
import { Box, Typography } from "@mui/material";
import { userService } from "../services/userService";

const People = () => {
  const [users, setUsers] = useState<UserType[]>([]);

  const fetchAndSetUsers = async () => {
    try {
      const data = await userService.fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchAndSetUsers();
  }, []);

  return (
    <Box
      sx={{
        marginTop: 2.5,
        marginRight: 2.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {users.map((user) => (
        <User
          key={user.id}
          id={user.id}
          username={user.username}
          avatarUrl={user.avatarUrl}
          backgroundUrl={user.backgroundUrl}
        />
      ))}
    </Box>
  );
};

export default People;
