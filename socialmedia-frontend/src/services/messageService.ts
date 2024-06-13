const API_BASE_URL = "http://localhost:8080";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    throw new Error("Authentication token not found.");
  }
  return token;
};

const sendMessage = async (
  receiverUsername: string,
  content: string,
  imageUrl: string | null = null
) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/messages/send/${receiverUsername}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: content, imageUrl }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send message: ${errorText}`);
  }

  return await response.json();
};

const getMessages = async (otherUsername: string) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/messages/${otherUsername}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status === 401) {
    window.location.href = "/";
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to retrieve messages: ${errorText}`);
  }

  return await response.json();
};

const deleteMessage = async (messageId: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/messages/${messageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete message: ${errorText}`);
  }

  return response.ok;
};

const getAllConversations = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/conversations`, {
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
    throw new Error(`Failed to list conversations: ${errorText}`);
  }

  return await response.json();
};

export const messageService = {
  sendMessage,
  getMessages,
  deleteMessage,
  getAllConversations,
};
