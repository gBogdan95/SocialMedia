const API_BASE_URL = "http://localhost:8080";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    throw new Error("Authentication token not found.");
  }
  return token;
};

const fetchUsers = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    window.location.href = "/";
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch users:", errorText);
    throw new Error("Failed to fetch users.");
  }

  const data = await response.json();
  return data;
};

const searchUsers = async (searchTerm: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/users/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ search: searchTerm }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to search users:", errorText);
    throw new Error("Failed to search users.");
  }

  const users = await response.json();
  return users;
};

const fetchUserById = async (userId: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    window.location.href = "/";
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to fetch user with ID ${userId}:`, errorText);
    throw new Error(`Failed to fetch user with ID ${userId}.`);
  }

  const data = await response.json();
  return data;
};

const fetchUserInventory = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/users/inventory`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    window.location.href = "/";
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch user inventory:", errorText);
    throw new Error("Failed to fetch user inventory.");
  }

  const inventory = await response.json();
  return inventory;
};

const updateUserProfile = async (
  name: string,
  phoneNumber: string,
  description: string
) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/users/update-profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, phoneNumber, description }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Update failed";
    throw new Error(errorMessage);
  }

  return response.json();
};

const updateAvatar = async (newAvatarUrl: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/users/update-avatar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newAvatarUrl }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to update avatar:", errorText);
    throw new Error("Failed to update avatar.");
  }

  return response.json();
};

const updateBackground = async (newBackgroundUrl: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/users/update-background`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newBackgroundUrl }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to update background:", errorText);
    throw new Error("Failed to update background.");
  }

  return response.json();
};

export const userService = {
  fetchUsers,
  searchUsers,
  fetchUserById,
  fetchUserInventory,
  updateUserProfile,
  updateAvatar,
  updateBackground,
};
