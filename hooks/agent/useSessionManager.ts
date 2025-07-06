import { useState, useCallback } from "react";
import { counselorService, type Session } from "@/services/api/counselor.service";

export function useSessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const sessionsData = await counselorService.getSessions();
      setSessions(sessionsData);
      return sessionsData;
    } catch (error) {
      console.error("Error loading sessions:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewSession = useCallback(async (sessionName?: string) => {
    try {
      setIsLoading(true);
      const newSession = await counselorService.createSession(sessionName);
      await loadSessions();
      setActiveSessionId(newSession.sessionId);
      return newSession;
    } catch (error) {
      console.error("Error creating new session:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadSessions]);

  const updateSessionChat = useCallback((sessionId: string, newChatEntry: any) => {
    setSessions((prev) =>
      prev.map((s) =>
        s._id === sessionId
          ? {
              ...s,
              chats: [...s.chats, newChatEntry],
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      await counselorService.deleteSession(sessionId);
      
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
      
      if (activeSessionId === sessionId) {
        const remainingSessions = sessions.filter((s) => s._id !== sessionId);
        if (remainingSessions.length > 0) {
          setActiveSessionId(remainingSessions[0]._id);
        } else {
          setActiveSessionId(null);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId, sessions]);

  return {
    sessions,
    activeSessionId,
    isLoading,
    setActiveSessionId,
    loadSessions,
    createNewSession,
    updateSessionChat,
    deleteSession,
  };
} 