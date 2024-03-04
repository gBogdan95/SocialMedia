import React from "react";
import { Box, Drawer } from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from "@mui/icons-material/Search";
import LockIcon from "@mui/icons-material/Lock";
import PeopleIcon from "@mui/icons-material/People";
import ShopIcon from "@mui/icons-material/Shop";
import SettingsIcon from "@mui/icons-material/Settings";

const LeftNavbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (!isAuthenticated) {
    return null;
  }

  const buttons = [
    {
      label: "CREATE",
      path: "/create-post",
      width: "150px",
      height: "120px",
      icon: <AddBoxIcon />,
    },
    {
      label: "EXPLORE",
      path: "/explore",
      width: "280px",
      height: "60px",
      icon: <SearchIcon />,
    },
    {
      label: "GROUPS",
      path: "/groups",
      width: "280px",
      height: "60px",
      icon: <LockIcon />,
    },
    {
      label: "PEOPLE",
      path: "/people",
      width: "280px",
      height: "60px",
      icon: <PeopleIcon />,
    },
    {
      label: "SHOP",
      path: "/shop",
      width: "280px",
      height: "60px",
      icon: <ShopIcon />,
    },
    {
      label: "SETTINGS",
      path: "/settings",
      width: "280px",
      height: "60px",
      icon: <SettingsIcon />,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 400,
        "& .MuiDrawer-paper": {
          width: 380,
          boxSizing: "border-box",
          height: "calc(100vh - 64px)",
          backgroundColor: "#D4F1F4",
          top: "64px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "20px",
        }}
      >
        {buttons.map((button, index) => (
          <Button
            key={button.label}
            variant="contained"
            startIcon={button.icon}
            onClick={() => handleNavigation(button.path)}
            sx={{
              minWidth: button.width,
              minHeight: button.height,
              fontSize: "1.5em",
              borderRadius: "10px",
              marginTop: index === 0 ? "10%" : "70px",
              backgroundColor: isActive(button.path) ? "#1450A3" : "#40A2D8",
              color: "white",
              "&:hover": {
                backgroundColor: isActive(button.path) ? "#1450A3" : "#1450A3",
              },
              boxShadow: "none",
            }}
          >
            {button.label}
          </Button>
        ))}
      </Box>
    </Drawer>
  );
};

export default LeftNavbar;
