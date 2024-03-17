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
    console.error("Failed to fetch users:", errorText);
    throw new Error("Failed to fetch users.");
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
    console.error(`Failed to fetch user with ID ${userId}:`, errorText);
    throw new Error(`Failed to fetch user with ID ${userId}.`);
  }

  const data = await response.json();
  return data;
};

const updateUserProfile = async (
  userId: string,
  username: string,
  email: string,
  description: string
) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/users/update-profile/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, description }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Update failed";
    throw new Error(errorMessage);
  }

  return response.json();
};

export const userService = {
  fetchUsers,
  fetchUserById,
  updateUserProfile,
};
