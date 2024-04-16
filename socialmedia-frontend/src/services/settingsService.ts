const API_BASE_URL = "http://localhost:8080";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    throw new Error("Authentication token not found.");
  }
  return token;
};

const updateUsername = async (
  userId: string,
  newUsername: string,
  password: string
) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/settings/update-username/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUsername, password }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update username: ${errorText}`);
  }

  return await response.json();
};

const updatePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/settings/update-password/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update password: ${errorText}`);
  }

  return await response.json();
};

const updateEmail = async (
  userId: string,
  password: string,
  newEmail: string
) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/settings/update-email/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, newEmail }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update email: ${errorText}`);
  }

  return await response.json();
};

export const settingsService = {
  updateUsername,
  updatePassword,
  updateEmail,
};
