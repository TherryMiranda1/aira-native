import { useState, useCallback, useRef } from "react";
import { Message, AgentOption } from "@/types/Assistant";
import {
    counselorService
} from "@/services/api/counselor.service";
import { useResponseMapper } from "./useResponseMapper";

const MAX_HISTORY_MESSAGES = 8;

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  hasMore: boolean;
  isLoading: boolean;
  messagesPerPage: number;
}

export function useAgentMessages(
  initialMessages: Message[] = [],
  sessionId?: string
) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalMessages: 0,
    hasMore: false,
    isLoading: false,
    messagesPerPage: 10,
  });

  const messageIdCounter = useRef(0);
  const loadedMessageIds = useRef<Set<string>>(new Set());
  const { convertChatToMessages } = useResponseMapper();

  const getNewMessageId = useCallback(() => {
    messageIdCounter.current += 1;
    return `aira-msg-${Date.now()}-${messageIdCounter.current}`;
  }, []);



  const loadPreviousMessages = useCallback(async () => {
    if (!sessionId || pagination.isLoading || !pagination.hasMore) {
      return;
    }

    setPagination((prev) => ({ ...prev, isLoading: true }));

    try {
      const nextPage = pagination.currentPage + 1;
      const response = await counselorService.getSessionMessages(
        sessionId,
        nextPage,
        pagination.messagesPerPage
      );

      const newMessages: Message[] = [];

              response.messages.forEach((chat, index) => {
          const convertedMessages = convertChatToMessages(chat, index);

          convertedMessages.forEach((msg: Message) => {
            if (!loadedMessageIds.current.has(msg.id)) {
              newMessages.push(msg);
              loadedMessageIds.current.add(msg.id);
            }
          });
        });

      if (newMessages.length > 0) {
        setMessages((prev) => [...newMessages, ...prev]);

        setPagination((prev) => ({
          ...prev,
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalMessages: response.pagination.totalMessages,
          hasMore: response.pagination.hasMore,
        }));
      }
    } catch (error) {
      console.error("Error loading previous messages:", error);
    } finally {
      setPagination((prev) => ({ ...prev, isLoading: false }));
    }
  }, [sessionId, pagination, convertChatToMessages]);

  const initializeFromSession = useCallback(
    async (sessionId: string) => {
      setPagination((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await counselorService.getSessionMessages(
          sessionId,
          1,
          10
        );

        const initialMessages: Message[] = [];
        loadedMessageIds.current.clear();

              response.messages.forEach((chat, index) => {
        const convertedMessages = convertChatToMessages(chat, index);

        convertedMessages.forEach((msg: Message) => {
          initialMessages.push(msg);
          loadedMessageIds.current.add(msg.id);
        });
      });

        setMessages(initialMessages);
        setPagination({
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalMessages: response.pagination.totalMessages,
          hasMore: response.pagination.hasMore,
          isLoading: false,
          messagesPerPage: response.pagination.messagesPerPage,
        });
      } catch (error) {
        console.error("Error initializing session messages:", error);
        setPagination((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [convertChatToMessages]
  );

  const addMessage = useCallback(
    (message: Omit<Message, "id" | "timestamp">): string => {
      const newId = getNewMessageId();
      const newMessage: Message = {
        ...message,
        sender: message.sender || "agent",
        id: newId,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updatedMessages = [...prev, newMessage];
        if (updatedMessages.length > MAX_HISTORY_MESSAGES * 2) {
          return updatedMessages.slice(-MAX_HISTORY_MESSAGES);
        }
        return updatedMessages;
      });

      loadedMessageIds.current.add(newId);
      return newId;
    },
    [getNewMessageId]
  );

  const addAgentMessage = useCallback(
    (
      text?: string,
      optionsInput?: AgentOption[],
      data?: Partial<
        Pick<
          Message,
          | "recipe"
          | "exercise"
          | "motivation"
          | "fullRoutine"
          | "dailyMealPlan"
          | "calendarData"
          | "isLoading"
          | "isError"
        >
      >
    ): string => {
      const optsToShow = optionsInput === undefined ? [] : optionsInput;

      return addMessage({
        sender: "agent",
        text,
        options: optsToShow,
        ...data,
      });
    },
    [addMessage]
  );

  const addUserMessage = useCallback(
    (text: string): string => {
      return addMessage({
        sender: "user",
        text,
        options: [],
      });
    },
    [addMessage]
  );

  const updateMessage = useCallback(
    (messageId: string, updates: Partial<Message>) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, ...updates, timestamp: new Date() }
            : msg
        )
      );
    },
    []
  );

  const clearAllOptions = useCallback(() => {
    setMessages((prev) => prev.map((msg) => ({ ...msg, options: [] })));
  }, []);

  const prepareChatHistory = useCallback((): {
    role: "user" | "model";
    text: string;
  }[] => {
    return messages
      .slice(-MAX_HISTORY_MESSAGES)
      .map((msg) => {
        let textContent = msg.text || "";

        if (msg.sender === "agent") {
          if (msg.recipe?.recipeName) {
            textContent = msg.recipe.clarificationQuestion
              ? `Aira preguntó: "${msg.recipe.clarificationQuestion}"`
              : `Aira sugirió la receta: ${msg.recipe.recipeName}. (Razón: ${
                  msg.recipe.reason || "Deliciosa y nutritiva"
                })`;
          } else if (msg.exercise?.exerciseName) {
            textContent = msg.exercise.clarificationQuestion
              ? `Aira preguntó: "${msg.exercise.clarificationQuestion}"`
              : `Aira sugirió el ejercicio: ${msg.exercise.exerciseName}. (Beneficios: ${msg.exercise.benefits})`;
          } else if (msg.motivation?.message) {
            textContent = msg.motivation.message;
          } else if (msg.fullRoutine?.nombreRutina) {
            textContent = `Aira sugirió la rutina: ${msg.fullRoutine.nombreRutina}. (Descripción: ${msg.fullRoutine.descripcionGeneral})`;
          } else if (msg.dailyMealPlan?.planTitle) {
            textContent = `Aira sugirió el plan de comidas: ${
              msg.dailyMealPlan.planTitle
            }. (Introducción: ${msg.dailyMealPlan.introduction || ""})`;
          } else if (msg.completePlan?.planNutricional) {
            textContent = `Aira sugirió el plan completo: ${msg.completePlan.planNutricional.mensajeIntroductorio}. (Desglose Macros: ${msg.completePlan.planNutricional.desgloseMacros.caloriasTotales})`;
          }
        }

        return {
          role: msg.sender === "user" ? "user" : "model",
          text: textContent,
        } as { role: "user" | "model"; text: string };
      })
      .filter((msg) => msg.text && msg.text.trim() !== "");
  }, [messages]);

  return {
    messages,
    pagination,
    setMessages,
    addMessage,
    addAgentMessage,
    addUserMessage,
    updateMessage,
    clearAllOptions,
    prepareChatHistory,
    loadPreviousMessages,
    initializeFromSession,
  };
}
