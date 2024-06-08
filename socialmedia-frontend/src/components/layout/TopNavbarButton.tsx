import React from "react";
import { Button } from "@mui/material";

interface NavbarButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  handleClick: () => void;
}

const NavbarButton: React.FC<NavbarButtonProps> = ({
  label,
  icon,
  isActive,
  handleClick,
}) => {
  return (
    <Button
      variant="contained"
      startIcon={icon}
      onClick={handleClick}
      sx={{
        minWidth: "250px",
        minHeight: "60px",
        fontSize: "1.5em",
        borderRadius: "10px",
        marginTop: "40px",
        backgroundColor: isActive ? "#1450A3" : "#40A2D8",
        color: "white",
        "&:hover": {
          backgroundColor: "#1450A3",
        },
        boxShadow: "none",
      }}
    >
      {label}
    </Button>
  );
};

export default NavbarButton;
