import React from "react";
import { Box } from "@mui/material";
import LeftNavbar from "./LeftNavbar";
import { useRightContent } from "../contexts/RightContentContext";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MainLayout = () => {
  const { content: RightSideContent } = useRightContent();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <LeftNavbar />
      <Box
        component="main"
        sx={{
          overflowY: "scroll",
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
          overflowY: "auto",
          wordBreak: "break-word",
          height: "calc(100vh - 64px)",
          position: "fixed",
          right: 0,
          top: "64px",
          backgroundColor: "#D3D3D3",
        }}
      >
        {RightSideContent}
      </Box>
    </Box>
  );
};

export default MainLayout;
