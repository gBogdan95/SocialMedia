import React from "react";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NotificationsIcon from "@mui/icons-material/NotificationsActive";
import EmailIcon from "@mui/icons-material/Email";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../assets/logo.png";

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
        <img
          src={logo}
          alt="Logo"
          style={{
            height: "3.5em",
            marginLeft: "10px",
            verticalAlign: "middle",
          }}
        />
        <Typography
          variant="h3"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: "default",
            fontWeight: "bold",
            verticalAlign: "middle",
            fontFamily: "Monotype Corsiva",
            letterSpacing: 5,
            marginLeft: "30px",
          }}
        >
          Social Media
        </Typography>
        <Box sx={{ flexGrow: 1 }} />{" "}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isAuthenticated && (
            <>
              <Button
                color="inherit"
                onClick={() => console.log("Notifications clicked")}
                startIcon={<AccountCircleIcon />}
                sx={{ textTransform: "none" }}
              >
                My Profile
              </Button>
              <Button
                color="inherit"
                onClick={() => console.log("Notifications clicked")}
                startIcon={<NotificationsIcon />}
                sx={{ textTransform: "none" }}
              >
                Notifications
              </Button>
              <Button
                color="inherit"
                onClick={() => console.log("Messages clicked")}
                startIcon={<EmailIcon />}
                sx={{ textTransform: "none" }}
              >
                Messages
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{ textTransform: "none" }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
