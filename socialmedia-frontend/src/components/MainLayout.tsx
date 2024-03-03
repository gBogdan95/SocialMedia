import React from "react";
import LeftNavbar from "./LeftNavbar";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <Box display="flex" height="100vh">
      {" "}
      <LeftNavbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
