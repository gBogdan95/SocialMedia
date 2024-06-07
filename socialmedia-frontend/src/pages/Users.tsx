import React, { useState, useEffect } from "react";
import User, { UserType } from "../components/users/User";
import {
  Container,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { userService } from "../services/userService";

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAndSetUsers = async () => {
    try {
      const data = await userService.fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchAndSetUsers();
      return;
    }
    try {
      const results = await userService.searchUsers(searchTerm);
      setUsers(results);
    } catch (error) {
      console.error("Failed to search users:", error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchAndSetUsers();
  };

  useEffect(() => {
    fetchAndSetUsers();
  }, []);

  return (
    <Container
      sx={{
        marginTop: 2.5,
        marginRight: 2.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "95%",
      }}
    >
      <TextField
        fullWidth
        label="Search Users"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        InputLabelProps={{ style: { fontSize: 25 } }}
        InputProps={{
          style: { fontSize: 25 },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={clearSearch}>
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2, mb: 4, width: "97%" }}
      />
      {users.map((user) => (
        <User
          key={user.id}
          id={user.id}
          username={user.username}
          avatarUrl={user.avatarUrl}
          backgroundUrl={user.backgroundUrl}
        />
      ))}
    </Container>
  );
};

export default Users;
