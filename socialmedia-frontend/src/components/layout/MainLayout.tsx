import React from "react";
import { Box } from "@mui/material";
import LeftNavbar from "./LeftNavbar";
import { Outlet, useLocation } from "react-router-dom";
import { useRightContent } from "../../contexts/RightContentContext";
import { useAuth } from "../../contexts/AuthContext";

const MainLayout = () => {
  const { content: RightSideContent } = useRightContent();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  const noOverflowRoutes = ["/settings", "/shop"];
  const shouldHideOverflow = noOverflowRoutes.includes(location.pathname);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <LeftNavbar />
      <Box
        component="main"
        sx={{
          overflowY: shouldHideOverflow ? "hidden" : "scroll",
          flexGrow: 1,
          height: "calc(100vh - 64px)",
          marginRight: "444px",
          marginTop: "64px",
        }}
      >
        <Outlet />
      </Box>
      <Box
        component="aside"
        sx={{
          width: "444px",
          wordBreak: "break-word",
          height: "calc(100vh - 64px)",
          position: "fixed",
          right: 0,
          top: "64px",
          backgroundColor: "lightgrey",
        }}
      >
        {RightSideContent}
      </Box>
    </Box>
  );
};

export default MainLayout;
