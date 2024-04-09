import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Conversation, { ConversationType } from "../components/Conversation";
import { messageService } from "../services/messageService";

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversationsData = await messageService.getAllConversations();
        setConversations(conversationsData);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      width="100%"
      overflow="auto"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: -0.1,
          mb: 5.7,
        }}
      >
        {conversations.map((conversation) => (
          <Conversation
            key={conversation.conversationId}
            conversationId={conversation.conversationId}
            otherParticipant={conversation.otherParticipant}
            lastMessage={conversation.lastMessage}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Messages;
