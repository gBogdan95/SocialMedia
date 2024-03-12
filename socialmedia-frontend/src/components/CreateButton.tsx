import React from "react";
import { Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

interface CreateButtonProps {
  handleOpenDialog: () => void;
}

const CreateButton: React.FC<CreateButtonProps> = ({ handleOpenDialog }) => {
  return (
    <Button
      variant="contained"
      startIcon={<AddBoxIcon />}
      onClick={handleOpenDialog}
      sx={{
        minWidth: "270px",
        minHeight: "120px",
        fontSize: "1.5em",
        borderRadius: "50px",
        marginTop: "120px",
        marginLeft: "65px",
        backgroundColor: "#40A2D8",
        color: "white",
        "&:hover": {
          backgroundColor: "#1450A3",
        },
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        position: "fixed",
        zIndex: 1,
      }}
    >
      CREATE POST
    </Button>
  );
};

export default CreateButton;
