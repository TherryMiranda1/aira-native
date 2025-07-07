import React, { useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AiraColors } from "@/constants/Colors";
import { MessageBubble, MessageContent } from "@/components/chat";
import { CounselorChatInput } from "./ChatInput";
import { PaginationInfo } from "@/services/api/counselor.service";
import { Message } from "@/types/Assistant";
import { ThemedText } from "../ThemedText";
import { CounselorSkeleton } from "../ui/FeedSkeleton";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  pagination?: PaginationInfo | null;
  onLoadMore?: () => void;
  showSkeleton?: boolean;
}

export default function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  pagination,
  onLoadMore,
}: ChatInterfaceProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim() || isLoading) return;
    onSendMessage(message);
    scrollToBottom();
  };

  const handleLoadMore = () => {
    if (pagination?.hasMore && onLoadMore && !isLoading) {
      onLoadMore();
    }
  };

  if (isLoading) {
    return <CounselorSkeleton type="chat" messagesCount={5} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {pagination?.hasMore && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={AiraColors.primary} />
            ) : (
              <ThemedText style={styles.loadMoreText}>
                Cargar mensajes anteriores
              </ThemedText>
            )}
          </TouchableOpacity>
        )}

        {messages.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <View style={styles.welcomeContainer}>
              <ThemedText type="defaultSemiBold" style={styles.welcomeTitle}>
                ¡Hola!
              </ThemedText>
              <ThemedText style={styles.welcomeSubtitle}>
                ¿En qué puedo ayudarte hoy?
              </ThemedText>
            </View>

            <View style={styles.suggestionsContainer}>
              <TouchableOpacity
                style={styles.suggestionCard}
                onPress={() =>
                  handleSendMessage("Me siento abrumado últimamente")
                }
              >
                <ThemedText style={styles.suggestionText}>
                  Me siento abrumado últimamente
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestionCard}
                onPress={() =>
                  handleSendMessage("Quiero establecer metas para mi bienestar")
                }
              >
                <ThemedText style={styles.suggestionText}>
                  Quiero establecer metas para mi bienestar
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {messages.map((message) => {
          return (
            <MessageBubble key={message.id} message={message}>
              <MessageContent message={message} />
            </MessageBubble>
          );
        })}
      </ScrollView>

      <CounselorChatInput
        onSend={handleSendMessage}
        isLoading={isLoading}
        placeholder="Escribe tu mensaje aquí..."
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 8,
  },
  loadMoreButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
  },
  loadMoreText: {
    color: AiraColors.primary,
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 24,
  },
  suggestionsContainer: {
    width: "100%",
    gap: 12,
  },
  suggestionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 15,
    textAlign: "center",
  },
});
