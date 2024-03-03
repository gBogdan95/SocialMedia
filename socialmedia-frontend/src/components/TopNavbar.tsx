import React, { ReactElement, useState } from "react";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NotificationsIcon from "@mui/icons-material/NotificationsActive";
import EmailIcon from "@mui/icons-material/Email";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../assets/logo.png";
import { useRightContent } from "../contexts/RightContentContext";
import MyProfile from "../pages/MyProfile";
import Notifications from "../pages/Notifications";
import Messages from "../pages/Messages";

export default function TopNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (
    buttonId: string,
    contentComponent: ReactElement
  ) => {
    setActiveButton(buttonId); // Update the active button state
    setContent(contentComponent); // Update the content in the right-side panel
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const { setContent } = useRightContent();

  const handleRightContentChange = (component: ReactElement) => {
    setContent(component);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ flexGrow: 1, zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
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
                onClick={() => handleButtonClick("myProfile", <MyProfile />)}
                startIcon={<AccountCircleIcon />}
                sx={{
                  textTransform: "none",
                  backgroundColor:
                    activeButton === "myProfile" ? "red" : "inherit",
                  "&:hover": {
                    backgroundColor: "red !important",
                  },
                  "&:focus": {
                    backgroundColor:
                      activeButton === "myProfile" ? "red" : "inherit",
                    outline: "none",
                  },
                  "&:active": {
                    backgroundColor:
                      activeButton === "myProfile" ? "red" : "inherit",
                  },
                }}
              >
                My Profile
              </Button>
              <Button
                color="inherit"
                onClick={() =>
                  handleButtonClick("notifications", <Notifications />)
                }
                startIcon={<NotificationsIcon />}
                sx={{
                  textTransform: "none",
                  backgroundColor:
                    activeButton === "notifications" ? "red" : "inherit",
                  "&:hover": {
                    backgroundColor: "red !important",
                  },
                  "&:focus": {
                    backgroundColor:
                      activeButton === "notifications" ? "red" : "inherit",
                    outline: "none",
                  },
                  "&:active": {
                    backgroundColor:
                      activeButton === "notifications" ? "red" : "inherit",
                  },
                }}
              >
                Notifications
              </Button>
              <Button
                color="inherit"
                onClick={() => handleButtonClick("messages", <Messages />)}
                startIcon={<EmailIcon />}
                sx={{
                  textTransform: "none",
                  backgroundColor:
                    activeButton === "messages" ? "red" : "inherit",
                  "&:hover": {
                    backgroundColor: "red !important",
                  },
                  "&:focus": {
                    backgroundColor:
                      activeButton === "messages" ? "red" : "inherit",
                    outline: "none",
                  },
                  "&:active": {
                    backgroundColor:
                      activeButton === "messages" ? "red" : "inherit",
                  },
                }}
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
