import React, { useState } from "react";

import { Box, Drawer } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CreateButton from "././CreateButton";
import NavbarButton from "./TopNavbarButton";
import CreatePostDialog from "../../components/posts/CreatePostDialog";
import { postService } from "../../services/postService";
import backgroundImage from "../../assets/leftNavbarBg.jpg";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import ShopIcon from "@mui/icons-material/Shop";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const LeftNavbar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [postContent, setPostContent] = useState("");

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleProfileNavigation = () => {
    if (user) {
      navigate(`/profile/${user.id}`);
    } else {
      console.error("User data is missing");
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPostContent("");
  };

  const handleSavePost = async (
    title: string,
    content: string,
    imageUrl?: string
  ) => {
    try {
      await postService.createPost(title, content, imageUrl);
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

  const isActive = (path: string) => {
    if (path === "/profile" && user) {
      return location.pathname === `/profile/${user.id}`;
    }
    return location.pathname === path;
  };

  const buttons = [
    {
      label: "POSTS",
      path: "/explore",
      icon: <SearchIcon />,
    },
    {
      label: "PROFILE",
      path: "/profile",
      icon: <AccountCircleIcon />,
      handleClick: handleProfileNavigation,
    },
    {
      label: "USERS",
      path: "/users",
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
              handleClick={
                button.handleClick || (() => handleNavigation(button.path))
              }
            />
          ))}
        </Box>
      </Drawer>
      <CreatePostDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSavePost}
      />
    </>
  );
};

export default LeftNavbar;
