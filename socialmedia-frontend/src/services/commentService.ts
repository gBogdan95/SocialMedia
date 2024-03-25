const API_BASE_URL = "http://localhost:8080";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    throw new Error("Authentication token not found.");
  }
  return token;
};

const fetchCommentsByPostId = async (postId: string) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/comments/by-post/${postId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Failed to fetch comments for post with ID ${postId}:`,
      errorText
    );
    throw new Error(`Failed to fetch comments for post with ID ${postId}.`);
  }

  const data = await response.json();
  return data;
};

const fetchCommentById = async (commentId: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/comments/${commentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to fetch comment with ID ${commentId}:`, errorText);
    throw new Error(`Failed to fetch comment with ID ${commentId}.`);
  }

  const data = await response.json();
  return data;
};

const createComment = async (postId: string, text: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/comments/${postId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create comment: ${errorText}`);
  }

  return response.json();
};

const updateComment = async (commentId: string, text: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to update comment with ID ${commentId}:`, errorText);
    throw new Error(`Failed to update comment with ID ${commentId}.`);
  }

  return response.json();
};

const likeComment = async (commentId: string) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/comments/${commentId}/like`,
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
    console.error(`Failed to like comment with ID ${commentId}:`, errorText);
    throw new Error(`Failed to like comment with ID ${commentId}.`);
  }

  return response.json();
};

const unlikeComment = async (commentId: string) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/user/comments/${commentId}/remove-like`,
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
    console.error(`Failed to unlike comment with ID ${commentId}:`, errorText);
    throw new Error(`Failed to unlike comment with ID ${commentId}.`);
  }

  return response.json();
};

const deleteComment = async (commentId: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/user/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to delete comment with ID ${commentId}:`, errorText);
    throw new Error(`Failed to delete comment with ID ${commentId}.`);
  }

  return true;
};

export const commentService = {
  fetchCommentsByPostId,
  fetchCommentById,
  createComment,
  updateComment,
  likeComment,
  unlikeComment,
  deleteComment,
};
