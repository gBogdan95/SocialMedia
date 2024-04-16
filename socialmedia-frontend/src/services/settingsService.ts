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
    const errorData = await response.json();
    const errorMessage = errorData.message || "Username update failed";
    throw new Error(errorMessage);
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
    const errorData = await response.json();
    const errorMessage = errorData.message || "Password update failed";
    throw new Error(errorMessage);
  }

  return await response.json();
};

const updateEmail = async (
  userId: string,
  newEmail: string,
  password: string
) => {
  const token = getToken();

  const payload = JSON.stringify({ password, newEmail });

  const response = await fetch(
    `${API_BASE_URL}/user/settings/update-email/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Email update failed";
    throw new Error(errorMessage);
  }

  return await response.json();
};

const updateFriendRequestSetting = async (
  userId: string,
  isAllowingFriendRequests: boolean
) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/settings/update-friend-request-setting/${userId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isAllowingFriendRequests }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      errorData.message || "Friend request setting update failed";
    throw new Error(errorMessage);
  }

  return await response.json();
};

export const settingsService = {
  updateUsername,
  updatePassword,
  updateEmail,
  updateFriendRequestSetting,
};
