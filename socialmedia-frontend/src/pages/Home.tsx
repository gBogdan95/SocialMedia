import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import currencyImg from "../assets/currency.png";
import GroupIcon from "@mui/icons-material/Group";
import defaultAvatarImg from "../assets/defaultAvatar.png";
import defaultBackgroundImg from "../assets/defaultBackground.jpg";
import { friendshipService } from "../services/friendshipService";
import Friend, { FriendType } from "../components/Friend";
import { userService } from "../services/userService";
import { useUser } from "../contexts/UserContext";

const Home = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<FriendType[]>([]);
  const { userDetails, setUserDetails } = useUser();

  const fetchAndSetFriends = async () => {
    try {
      const data = await friendshipService.listFriends();
      setFriends(data);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (user && user.id) {
        const userData = await userService.fetchUserById(user.id);
        setUserDetails(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    fetchAndSetFriends();
    fetchUserDetails();
  }, []);

  const handleProfileClick = () => {
    if (userDetails) {
      navigate(`/profile/${userDetails.id}`);
    }
  };

  const backgroundStyle = {
    backgroundImage: userDetails?.backgroundUrl
      ? `url(${userDetails.backgroundUrl})`
      : `url(${defaultBackgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100%">
      <Box
        sx={{
          ...backgroundStyle,
          position: "relative",
          color: "white",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": {
            "&::after": {
              content: '""',
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              zIndex: 1,
              backdropFilter: "blur(2px)",
            },
            "& .profileHoverText": {
              cursor: "pointer",
              display: "flex",
              zIndex: 2,
            },
          },
        }}
        onClick={handleProfileClick}
      >
        <Box
          sx={{
            mt: 2,
            width: 150,
            height: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
          }}
        >
          <Box
            component="img"
            src={userDetails?.avatarUrl || defaultAvatarImg}
            alt="avatar"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
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
            {userDetails?.username}
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
            Currency: {userDetails?.currency}
          </Typography>
          <Box
            component="img"
            src={currencyImg}
            alt="Currency"
            sx={{ width: 30, height: 30 }}
          />
        </Box>

        <Typography
          sx={{
            display: "none",
            fontWeight: "bold",
            fontSize: 50,
            color: "white",
            position: "absolute",
            borderRadius: "20px",
            p: 2,
          }}
          className="profileHoverText"
        >
          View Profile
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: 24,
          fontWeight: "bold",
          color: "white",
          p: 1,
          pl: 2,
          backgroundColor: "#1450A3",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
        }}
      >
        <GroupIcon sx={{ marginRight: 1 }} />
        My Friends:
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        width="100%"
        overflow="auto"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 8,
          }}
        >
          {friends.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 22,
              }}
            >
              <Typography sx={{ color: "black", fontSize: 35 }}>
                You have no friends yet.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  fontSize: 20,
                }}
                onClick={() => navigate("/users")}
              >
                Find Friends
              </Button>
            </Box>
          ) : (
            friends.map((user) => (
              <Friend
                key={user.id}
                id={user.id}
                username={user.username}
                avatarUrl={user.avatarUrl}
                backgroundUrl={user.backgroundUrl}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
