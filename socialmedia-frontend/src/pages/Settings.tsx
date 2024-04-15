import React from "react";
import { Box, Button, Typography } from "@mui/material";

const Settings: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Box width="100%" maxWidth={700}>
        <Typography
          variant="h6"
          sx={{
            fontSize: 25,
            bgcolor: "#1450A3",
            color: "common.white",
            cursor: "default",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
            py: 2.5,
            textAlign: "center",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          ACCOUNT
        </Typography>
        <Box sx={{ border: 1, borderColor: "black" }}>
          {["Change Username", "Change Password", "Change Email"].map(
            (text, index) => (
              <Button
                key={text}
                variant="text"
                fullWidth
                sx={{
                  fontSize: 20,
                  color: "text.primary",
                  py: 3,
                  borderColor: "black",
                  "&:not(:last-child)": {
                    borderBottom: 1,
                  },
                  "&:hover": {
                    bgcolor: "primary.secondary",
                  },
                  borderRadius: 0,
                  boxShadow: "none",
                }}
              >
                {text}
              </Button>
            )
          )}
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: 25,
            bgcolor: "#1450A3",
            color: "common.white",
            cursor: "default",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
            py: 2.5,
            textAlign: "center",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          PRIVACY
        </Typography>
      </Box>
    </Box>
  );
};

export default Settings;
