const API_BASE_URL = "http://localhost:8080";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    throw new Error("Authentication token not found.");
  }
  return token;
};

const sendFriendRequest = async (receiverUsername: string) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/friendships/send/${receiverUsername}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send friend request: ${errorText}`);
  }
};

const acceptFriendRequest = async (friendshipId: string) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/friendships/accept/${friendshipId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to accept friend request: ${errorText}`);
  }
};

const declineFriendRequest = async (friendshipId: string) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/friendships/decline/${friendshipId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to decline friend request: ${errorText}`);
  }
};

const listPendingFriendRequests = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/friendships/requests`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to list pending friend requests: ${errorText}`);
  }

  return await response.json();
};

const listFriends = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/friendships/friends`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to list friends: ${errorText}`);
  }

  return await response.json();
};

const removeFriend = async (friendId: string) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/friendships/friends/${friendId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to remove friend: ${errorText}`);
  }
};

export const friendshipService = {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  listPendingFriendRequests,
  listFriends,
  removeFriend,
};
