// Messages.tsx
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
    <Box>
      {conversations.map((conversation) => (
        <Conversation
          key={conversation.conversationId}
          conversationId={conversation.conversationId}
          otherParticipant={conversation.otherParticipant}
          lastMessage={conversation.lastMessage}
        />
      ))}
    </Box>
  );
};

export default Messages;
