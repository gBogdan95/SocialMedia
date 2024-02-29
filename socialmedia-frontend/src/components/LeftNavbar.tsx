import React from "react";
import { Box, Drawer } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

const LeftNavbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 400,
        "& .MuiDrawer-paper": {
          width: 400,
          boxSizing: "border-box",
          height: "calc(100vh - 64px)",
          backgroundColor: "lightblue",
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
          position: "relative",
          paddingTop: "20px",
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddBoxIcon />}
          onClick={() => handleNavigation("create-post")}
          sx={{
            minWidth: "250px",
            minHeight: "120px",
            fontSize: "1.5em",
            borderRadius: "10px",
            position: "absolute",
            top: "5%",
            backgroundColor: "#2979ff",
            color: "white",
            "&:hover": {
              backgroundColor: "#5393ff",
            },
            boxShadow: "none",
          }}
        >
          CREATE POST
        </Button>
      </Box>
    </Drawer>
  );
};

export default LeftNavbar;
