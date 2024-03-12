import React, { useState } from "react";

import { Box, Drawer } from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CreateButton from "./CreateButton";
import NavbarButton from "./NavbarButton";
import PostDialog from "./PostDialog";
import { postService } from "../services/postService";
import backgroundImage from "../assets/leftNavbarBg.jpg";
import SearchIcon from "@mui/icons-material/Search";
import LockIcon from "@mui/icons-material/Lock";
import PeopleIcon from "@mui/icons-material/People";
import ShopIcon from "@mui/icons-material/Shop";
import SettingsIcon from "@mui/icons-material/Settings";

const LeftNavbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [postContent, setPostContent] = useState("");

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPostContent("");
  };

  const handleSavePost = async (content: string) => {
    try {
      await postService.createPost(content);
      handleCloseDialog();
      navigate("/explore", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Failed to save the post", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  const buttons = [
    {
      label: "EXPLORE",
      path: "/explore",
      icon: <SearchIcon />,
    },
    {
      label: "GROUPS",
      path: "/groups",
      icon: <LockIcon />,
    },
    {
      label: "PEOPLE",
      path: "/people",
      icon: <PeopleIcon />,
    },
    {
      label: "SHOP",
      path: "/shop",
      icon: <ShopIcon />,
    },
    {
      label: "SETTINGS",
      path: "/settings",
      icon: <SettingsIcon />,
    },
  ];

  return (
    <>
      <CreateButton handleOpenDialog={handleOpenDialog} />

      <Drawer
        variant="permanent"
        sx={{
          width: 400,
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
            height: "auto",
            backgroundImage: `url(${backgroundImage})`,
            margin: "310px 50px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
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
            paddingTop: "5px",
            paddingBottom: "40px",
          }}
        >
          {buttons.map((button) => (
            <NavbarButton
              key={button.label}
              label={button.label}
              icon={button.icon}
              isActive={isActive(button.path)}
              handleClick={() => handleNavigation(button.path)}
            />
          ))}
        </Box>
      </Drawer>
      <PostDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        handleSavePost={handleSavePost}
      />
    </>
  );
};

export default LeftNavbar;
