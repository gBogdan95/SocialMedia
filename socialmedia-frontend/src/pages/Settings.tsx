import React from "react";
import { Box, Button, Typography, Checkbox } from "@mui/material";

const Settings: React.FC = () => {
  const [blockMessages, setBlockMessages] = React.useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlockMessages(event.target.checked);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{ mt: -4, mr: 6 }}
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
                    bgcolor: "lightgrey",
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
        <Box
          sx={{
            border: 1,
            borderColor: "black",
            px: 3,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              ml: -1.7,
            }}
          >
            <Checkbox
              checked={blockMessages}
              onChange={handleCheckboxChange}
              name="blockMessages"
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: "2rem",
                },
              }}
            />
            <Typography sx={{ fontSize: 20, fontWeight: "bold", mr: 2 }}>
              Block messages from non-friends
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 16, wordBreak: "break-word" }}>
            By selecting this option you will no longer receive messages from
            users that are not in your friendlist.
          </Typography>
        </Box>
        <Box
          sx={{
            border: 1,
            borderColor: "black",
            px: 3,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              ml: -1.7,
            }}
          >
            <Checkbox
              checked={blockMessages}
              onChange={handleCheckboxChange}
              name="blockMessages"
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: "2rem",
                },
              }}
            />
            <Typography sx={{ fontSize: 20, fontWeight: "bold", mr: 2 }}>
              Block friend requests
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 16, wordBreak: "break-word" }}>
            By selecting this option you will no longer receive receive friend
            requests.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
