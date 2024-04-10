export const getCurrentUsername = (): string | null => {
  const storedUserData = localStorage.getItem("user");
  if (storedUserData) {
    try {
      const userObject = JSON.parse(storedUserData);
      return userObject.username;
    } catch (error) {
      console.error("Error parsing user data from local storage:", error);
      return null;
    }
  }
  return null;
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
