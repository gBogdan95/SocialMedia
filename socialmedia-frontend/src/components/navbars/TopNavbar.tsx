import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function TopNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ flexGrow: 1 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => console.log("Logo clicked")}
        >
          SocialMedia
        </Typography>

        {isAuthenticated ? (
          <>
            <Button
              color="inherit"
              onClick={() => console.log("Notifications clicked")}
            >
              Notifications
            </Button>
            <Button
              color="inherit"
              onClick={() => console.log("Messages clicked")}
            >
              Messages
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}
