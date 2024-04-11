import React from "react";

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

export const parseTextToLinkElements = (text: string): React.ReactNode[] => {
  const urlRegex = /(\bhttps?:\/\/\S+)/gi;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  text.replace(urlRegex, (match, url, offset) => {
    const textBeforeUrl = text.substring(lastIndex, offset);
    if (textBeforeUrl) {
      elements.push(textBeforeUrl);
    }
    elements.push(
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#0645AD" }}
      >
        {url}
      </a>
    );
    lastIndex = offset + match.length;
    return match;
  });

  const remainingText = text.substring(lastIndex);
  if (remainingText) {
    elements.push(remainingText);
  }

  return elements;
};
