const API_BASE_URL = "http://localhost:8080";

async function register(username: string, password: string, email: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Registration failed";
    throw new Error(errorMessage);
  }

  return response.json();
}

async function login(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Login failed";
    throw new Error(errorMessage);
  }

  return response.json();
}

export const authService = {
  register,
  login,
};
