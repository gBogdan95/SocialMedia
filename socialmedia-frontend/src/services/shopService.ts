const API_BASE_URL = "http://localhost:8080";
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token not found.");
  }
  return token;
};

const getAllShopItems = async () => {
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
    console.error("Failed to fetch shop items:", errorText);
    throw new Error("Failed to fetch shop items.");
  }

  return await response.json();
};

const purchaseItem = async (itemId: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/shop/purchase/${itemId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.json();
    console.error(
      "Failed to purchase item:",
      errorText.message || "Unknown error"
    );
    throw new Error(errorText.message || "Failed to purchase item");
  }

  return await response.json();
};

export const shopService = {
  getAllShopItems,
  purchaseItem,
};
