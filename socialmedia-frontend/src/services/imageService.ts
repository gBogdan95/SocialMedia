const API_BASE_URL = "http://localhost:8080";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    throw new Error("Authentication token not found.");
  }
  return token;
};

const getAllImages = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/shop/items`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch images:", errorText);
    throw new Error("Failed to fetch images.");
  }

  const items = await response.json();
  return items;
};

const getImage = async (itemId: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/shop/purchase/${itemId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to get image:", errorText);
    throw new Error("Failed to get image.");
  }

  const inventoryUpdate = await response.json();
  return inventoryUpdate;
};

export const imageService = {
  getAllImages,
  getImage,
};
