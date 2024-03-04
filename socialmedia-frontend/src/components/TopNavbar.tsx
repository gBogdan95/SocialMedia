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
  const initialActiveButton =
    localStorage.getItem("defaultRightContent") || "myProfile";
  const [activeButton, setActiveButton] = useState<string | null>(
    initialActiveButton
  );

  const { setContent } = useRightContent();

  const handleButtonClick = (
    buttonId: string,
    contentComponent: ReactElement
  ) => {
    setActiveButton(buttonId);
    setContent(contentComponent, buttonId);
  };

  const handleLogout = () => {
    localStorage.setItem("defaultRightContent", "myProfile");
    setActiveButton("myProfile");
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        flexGrow: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar disableGutters sx={{ width: "100%", padding: 0 }}>
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
                  height: "100%",
                  minHeight: "64px",
                  backgroundColor:
                    activeButton === "myProfile" ? "#1450A3" : "#inherit",
                  "&:hover": {
                    backgroundColor: "#1450A3",
                  },
                  "&:focus": {
                    backgroundColor:
                      activeButton === "myProfile" ? "#1450A3" : "#inherit",
                    outline: "none",
                  },
                  "&:active": {
                    backgroundColor:
                      activeButton === "myProfile" ? "#1450A3" : "#inherit",
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
                  height: "100%",
                  minHeight: "64px",
                  backgroundColor:
                    activeButton === "notifications" ? "#1450A3" : "inherit",
                  "&:hover": {
                    backgroundColor: "#1450A3",
                  },
                  "&:focus": {
                    backgroundColor:
                      activeButton === "notifications" ? "#1450A3" : "inherit",
                    outline: "none",
                  },
                  "&:active": {
                    backgroundColor:
                      activeButton === "notifications" ? "#1450A3" : "inherit",
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
                  height: "100%",
                  minHeight: "64px",
                  backgroundColor:
                    activeButton === "messages" ? "#1450A3" : "inherit",
                  "&:hover": {
                    backgroundColor: "#1450A3",
                  },
                  "&:focus": {
                    backgroundColor:
                      activeButton === "messages" ? "#1450A3" : "inherit",
                    outline: "none",
                  },
                  "&:active": {
                    backgroundColor:
                      activeButton === "messages" ? "#1450A3" : "inherit",
                  },
                }}
              >
                Messages
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  textTransform: "none",
                  height: "100%",
                  minHeight: "64px",
                  minWidth: "110px",
                  "&:hover": {
                    backgroundColor: "lightblue !important",
                  },
                }}
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
