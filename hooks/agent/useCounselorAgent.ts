import { useEffect, useCallback, useRef, useState } from "react";
import { counselorService } from "@/services/api/counselor.service";
import { useAgentMessages } from "./useAgentMessages";
import { useResponseMapper } from "./useResponseMapper";
import { useSessionManager } from "./useSessionManager";
import { Message } from "@/types/Assistant";
import { DEFAULT_OPTIONS } from "@/hooks/agent/agentActions.constants";

const GREETING_MESSAGE =
  "Hola, soy Aira, tu consejera personal. Estoy aquí para ayudarte a crear planes, darte apoyo o simplemente conversar. ¿En qué puedo ayudarte hoy?";

export function useCounselorAgent() {
  const [isProcessing, setIsProcessing] = useState(false);
  const initialLoadRef = useRef(false);
  
  const { processToolResponse } = useResponseMapper();
  const {
    sessions,
    activeSessionId,
    isLoading: sessionLoading,
    setActiveSessionId,
    loadSessions,
    createNewSession: createSession,
    updateSessionChat,
    deleteSession: deleteSessionFromManager,
  } = useSessionManager();

  const {
    messages,
    pagination,
    setMessages,
    addUserMessage,
    updateMessage,
    addAgentMessage,
    loadPreviousMessages: loadPreviousMessagesFromHook,
    initializeFromSession,
  } = useAgentMessages([], activeSessionId || undefined);

  const initializeSession = useCallback(async () => {
    const sessionsData = await loadSessions();

    if (sessionsData.length > 0 && !activeSessionId) {
      const latestSession = sessionsData[0];
      setActiveSessionId(latestSession._id);

      if (latestSession.chats.length > 0) {
        await initializeFromSession(latestSession._id);
      } else {
        setMessages([
          {
            id: "greeting",
            sender: "agent",
            text: GREETING_MESSAGE,
            timestamp: new Date(),
            options: DEFAULT_OPTIONS,
          },
        ]);
      }
    }
  }, [activeSessionId, initializeFromSession, setMessages, loadSessions, setActiveSessionId]);

  const setActiveSession = useCallback(
    async (sessionId: string) => {
      if (sessionId === activeSessionId) return;

      setActiveSessionId(sessionId);
      setMessages([]);

      const session = sessions.find((s) => s._id === sessionId);
      if (session && session.chats.length > 0) {
        await initializeFromSession(sessionId);
      } else {
        setMessages([
          {
            id: "greeting",
            sender: "agent",
            text: GREETING_MESSAGE,
            timestamp: new Date(),
            options: DEFAULT_OPTIONS,
          },
        ]);
      }
    },
    [activeSessionId, sessions, initializeFromSession, setMessages, setActiveSessionId]
  );

  const createNewSession = useCallback(
    async (sessionName?: string) => {
      try {
        const newSession = await createSession(sessionName);
        setMessages([]);

        const welcomeMessage: Message = {
          id: "greeting-new",
          text: GREETING_MESSAGE,
          sender: "agent",
          timestamp: new Date(),
          options: DEFAULT_OPTIONS,
        };

        setMessages([welcomeMessage]);
      } catch (error) {
        console.error("Error creating new session:", error);
      }
    },
    [createSession, setMessages]
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await deleteSessionFromManager(sessionId);
        
        if (sessionId === activeSessionId) {
          const remainingSessions = sessions.filter((s) => s._id !== sessionId);
          if (remainingSessions.length > 0) {
            await setActiveSession(remainingSessions[0]._id);
          } else {
            setMessages([
              {
                id: "greeting-empty",
                sender: "agent",
                text: GREETING_MESSAGE,
                timestamp: new Date(),
                options: DEFAULT_OPTIONS,
              },
            ]);
          }
        }
        
        return true;
      } catch (error) {
        console.error("Error deleting session:", error);
        throw error;
      }
    },
    [deleteSessionFromManager, activeSessionId, sessions, setActiveSession, setMessages]
  );

  const processUserMessage = useCallback(
    async (userMessage: string) => {
      if (!activeSessionId || !userMessage.trim()) return;

      addUserMessage(userMessage);
      setIsProcessing(true);
      const loadingMsgId = addAgentMessage("Aira está pensando...", [], {
        isLoading: true,
      });

      try {
        const response = await counselorService.sendChatMessage(
          activeSessionId,
          userMessage
        );

        const agentMessageUpdate = processToolResponse(response);
        updateMessage(loadingMsgId, agentMessageUpdate);

        const newChatEntry = {
          question: userMessage,
          aiResponse: JSON.stringify(response),
          timestamp: new Date().toISOString(),
        };

        updateSessionChat(activeSessionId, newChatEntry);
      } catch (error) {
        console.error("Error sending message:", error);

        updateMessage(loadingMsgId, {
          text: "Lo siento, hubo un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo?",
          isError: true,
          isLoading: false,
          options: DEFAULT_OPTIONS,
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [activeSessionId, addUserMessage, addAgentMessage, updateMessage, processToolResponse, updateSessionChat]
  );

  const loadPreviousMessages = useCallback(async () => {
    if (!activeSessionId || !pagination?.hasMore || sessionLoading || isProcessing) return;
    await loadPreviousMessagesFromHook();
  }, [activeSessionId, pagination, sessionLoading, isProcessing, loadPreviousMessagesFromHook]);

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      initializeSession();
    }
  }, [initializeSession]);

  const isLoading = sessionLoading || isProcessing || 
    (messages.length > 0 && !!messages[messages.length - 1].isLoading);

  return {
    messages,
    sessions,
    activeSessionId,
    isLoading,
    pagination,
    processUserMessage,
    setActiveSession,
    createNewSession,
    deleteSession,
    loadPreviousMessages,
  };
}
