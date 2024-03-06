const API_BASE_URL = "http://localhost:8080";

const fetchPosts = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(`${API_BASE_URL}/user/posts`, {
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

export const postService = {
  fetchPosts,
};
