import { denoAiApiClient } from "./apiClient";

export interface Chat {
  question: string;
  aiResponse: string;
  timestamp: string;
}

export interface Session {
  _id: string;
  sessionName: string;
  chats: Chat[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  hasMore: boolean;
  messagesPerPage: number;
}

export interface SessionInfo {
  sessionId: string;
  sessionName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMessagesResponse {
  messages: Chat[];
  pagination: PaginationInfo;
  sessionInfo: SessionInfo;
}

interface CreateSessionResponse {
  sessionId: string;
  sessionName: string;
}

interface ChatResponse {
  reply: string;
  sessionId: string;
  tool_used: string | null;
  data: any;
}

const createSession = async (
  sessionName?: string
): Promise<CreateSessionResponse> => {
  const response = await denoAiApiClient.post("/counselor/sessions", {
    sessionName,
  });
  return response.data;
};

const getSessions = async (): Promise<Session[]> => {
  const response = await denoAiApiClient.get("/counselor/sessions");
  return response.data;
};

const getSessionMessages = async (
  sessionId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedMessagesResponse> => {
  const response = await denoAiApiClient.get(
    `/counselor/sessions/${sessionId}/messages?page=${page}&limit=${limit}`
  );
  return response.data;
};

const sendChatMessage = async (
  sessionId: string,
  message: string
): Promise<ChatResponse> => {
  const response = await denoAiApiClient.post(`/counselor/chat/${sessionId}`, {
    message,
  });
  return response.data;
};

const deleteSession = async (sessionId: string): Promise<void> => {
  await denoAiApiClient.delete(`/counselor/sessions/${sessionId}`);
};

export const counselorService = {
  createSession,
  getSessions,
  getSessionMessages,
  sendChatMessage,
  deleteSession,
}; 