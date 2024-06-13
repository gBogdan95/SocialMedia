const API_BASE_URL = "http://localhost:8080";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    throw new Error("Authentication token not found.");
  }
  return token;
};

const fetchPostById = async (postId: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/posts/${postId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch post with ID ${postId}: ${errorText}`);
  }

  const data = await response.json();
  return data;
};

const fetchPosts = async () => {
  const token = getToken();

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

const fetchPostsByUserId = async (userId: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/posts/by-user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Failed to fetch posts for user with ID ${userId}:`,
      errorText
    );
    throw new Error(`Failed to fetch posts for user with ID ${userId}.`);
  }

  const data = await response.json();
  return data;
};

const createPost = async (
  title: string,
  postContent: string,
  imageUrl?: string
) => {
  const token = getToken();
  const body = JSON.stringify({
    title,
    text: postContent,
    imageUrl,
  });

  const response = await fetch(`${API_BASE_URL}/user/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create post: ${errorText}`);
  }

  return response.json();
};

const updatePost = async (
  postId: string,
  title: string,
  postContent: string,
  imageUrl?: string | null | undefined
) => {
  const token = getToken();
  const body = JSON.stringify({
    title,
    text: postContent,
    imageUrl,
  });

  const response = await fetch(`${API_BASE_URL}/user/posts/${postId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to update post with ID ${postId}:`, errorText);
    throw new Error(`Failed to update post with ID ${postId}.`);
  }

  return response.json();
};

const likePost = async (postId: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/posts/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to like post with ID ${postId}:`, errorText);
    throw new Error(`Failed to like post with ID ${postId}.`);
  }

  return response.json();
};

const unlikePost = async (postId: string) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/posts/${postId}/remove-like`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to unlike post with ID ${postId}:`, errorText);
    throw new Error(`Failed to unlike post with ID ${postId}.`);
  }

  return response.json();
};

const deletePost = async (postId: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/posts/${postId}`, {
    method: "DELETE",
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
    console.error(`Failed to delete post with ID ${postId}:`, errorText);
    throw new Error(`Failed to delete post with ID ${postId}.`);
  }

  return true;
};

const uploadImage = async (file: File): Promise<string> => {
  const token = getToken();
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/user/images/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to upload image:", errorText);
    throw new Error("Failed to upload image.");
  }

  const data = await response.json();
  return data.imageUrl;
};

export const postService = {
  fetchPosts,
  fetchPostById,
  fetchPostsByUserId,
  createPost,
  updatePost,
  likePost,
  unlikePost,
  deletePost,
  uploadImage,
};
