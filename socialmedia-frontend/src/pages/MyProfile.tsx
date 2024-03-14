import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAuth } from "../contexts/AuthContext";
import currencyImg from "../assets/currency.png";
import backgroundImg from "../assets/profileBg.jpg";

const MyProfile = () => {
  const { user } = useAuth();

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100%">
      <Box
        sx={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            mt: 2,
            width: 150,
            height: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            borderRadius: "50%",
          }}
        >
          {user?.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt="avatar"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          )}
        </Box>

        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "20px",
            p: 1,
            mt: 1,
            mb: 1,
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: 30, color: "white" }}>
            {user?.username}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "20px",
            p: 1,
          }}
        >
          <Typography sx={{ fontSize: 28, color: "white", mr: 1 }}>
            Currency: {user?.currency}
          </Typography>
          <Box
            component="img"
            src={currencyImg}
            alt="Currency"
            sx={{ width: 24, height: 24 }}
          />
        </Box>
      </Box>

      <Box bgcolor="red" flex={1} overflow="auto"></Box>
    </Box>
  );
};

export default MyProfile;
