// services/authService.ts

const API_BASE_URL = "http://localhost:8080";

async function register(username: string, password: string, email: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, email }),
  });

  if (!response.ok) {
    // If the server response is not ok, throw an error with the response
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
}

// You can add a similar function for login here...

export const authService = {
  register,
  // login, // When you implement it
};
