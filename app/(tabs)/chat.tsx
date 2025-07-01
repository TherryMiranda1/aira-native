import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { PageView } from "@/components/ui/PageView";
import { useHealthAgent } from "@/hooks/useHealthAgent";
import {
  MessageBubble,
  MessageContent,
  ChatOptions,
  QuickReplies,
  ChatInput,
} from "@/components/chat";
import { isProUser } from "@/utils/payments";

export default function ChatScreen() {
  const [inputMessage, setInputMessage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, isLoading, processUserMessage, handleOptionClick } =
    useHealthAgent();

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!(await isProUser())) {
      return;
    }

    if (!inputMessage.trim() || isLoading) return;

    processUserMessage(inputMessage);
    setInputMessage("");
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
  };

  const quickReplies = [
    "Me siento abrumada",
    "Necesito motivación",
    "¿Cómo empiezo?",
    "Tengo un mal día",
  ];

  const lastMessage = messages[messages.length - 1];
  const hasOptions = lastMessage?.options && lastMessage.options.length > 0;

  return (
    <PageView>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <Topbar title="Chat con Aira" actions={<ProfileButton />} />

        <View style={styles.messagesContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText style={styles.subtitle} type="subtitle">
              Un espacio seguro para compartir y crecer juntas
            </ThemedText>

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message}>
                <MessageContent message={message} />
              </MessageBubble>
            ))}

            {hasOptions && (
              <ChatOptions
                options={lastMessage.options!}
                onOptionClick={handleOptionClick}
              />
            )}
          </ScrollView>
        </View>

        <QuickReplies
          replies={quickReplies}
          onReplySelect={handleQuickReply}
          visible={messages.length === 0}
        />

        <ChatInput
          value={inputMessage}
          onChangeText={setInputMessage}
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.card,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  subtitle: {
    color: AiraColors.mutedForeground,
    fontSize: 16,
    marginBottom: 8,
  },
});
