import { useCallback } from "react";
import { Message } from "@/types/Assistant";
import {
  mapResponseToMessage,
  getMessageOptions,
  ACTION_CONFIGS,
} from "./agentActions.constants";

export function useResponseMapper() {
  const convertChatToMessages = useCallback(
    (chat: any, index: number): Message[] => {
      const messageId = `session-msg-${chat.timestamp}-${index}`;

      try {
        const parsedResponse = JSON.parse(chat.aiResponse);

        const userMessage: Message = {
          id: `${messageId}-user`,
          sender: "user",
          text: chat.question,
          timestamp: new Date(chat.timestamp),
          options: [],
        };

        const agentMessage: Message = {
          id: `${messageId}-agent`,
          sender: "agent",
          text: parsedResponse.reply,
          timestamp: new Date(chat.timestamp),
          options: [],
          ...mapResponseToMessage(
            parsedResponse.tool_used,
            parsedResponse.data
          ),
        };

        return [userMessage, agentMessage];
      } catch (error) {
        console.warn("Error parsing chat response:", error);

        return [
          {
            id: `${messageId}-user`,
            sender: "user",
            text: chat.question,
            timestamp: new Date(chat.timestamp),
            options: [],
          },
          {
            id: `${messageId}-agent`,
            sender: "agent",
            text: chat.aiResponse,
            timestamp: new Date(chat.timestamp),
            options: [],
          },
        ];
      }
    },
    []
  );

  const processToolResponse = useCallback((response: any): Partial<Message> => {
    const messageText =
      response.data?.message ||
      response.data?.clarificationQuestion ||
      response.reply;

    const messageUpdate: Partial<Message> = {
      text: messageText,
      isLoading: false,
      options: getMessageOptions(response.tool_used, !!response.data),
      ...mapResponseToMessage(response.tool_used, response.data),
    };

    if (response.tool_used === "motivation" && response.data) {
      messageUpdate.motivation = response.data;
    }

    return messageUpdate;
  }, []);

  return {
    convertChatToMessages,
    processToolResponse,
  };
}
