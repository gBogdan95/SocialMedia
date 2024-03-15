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

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch posts:", errorText);
    throw new Error("Failed to fetch posts.");
  }

  const data = await response.json();
  return data;
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

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to fetch post with ID ${userId}:`, errorText);
    throw new Error(`Failed to fetch post with ID ${userId}.`);
  }

  const data = await response.json();
  return data;
};

export const userService = {
  fetchUsers,
  fetchUserById,
};
