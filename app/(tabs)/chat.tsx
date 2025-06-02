import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { PageView } from "@/components/ui/PageView";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola hermosa! 💜 Soy Aira y estoy aquí para acompañarte. ¿Cómo te sientes hoy? Puedes contarme lo que quieras, estoy aquí para escucharte sin juicios.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const getAiraResponse = (userMessage: string): string => {
    const responses = [
      "Te escucho con mucho cariño. Es completamente válido sentirse así, y quiero que sepas que estás siendo muy valiente al compartir esto conmigo 💕",
      "Gracias por confiar en mí. Cada paso que das, por pequeño que sea, es importante. ¿Te apetece que exploremos esto juntas?",
      "Me parece hermoso que te tomes el tiempo para reflexionar sobre esto. Tu bienestar es una prioridad, no un lujo 🌸",
      "Estoy muy orgullosa de ti por dar este paso. Recuerda que el camino del cuidado personal es único para cada persona.",
      "Tu honestidad me conmueve. ¿Sabes qué? Está perfecto no tener todas las respuestas. Estamos aquí para descubrirlas juntas ✨",
      "Me alegra que hayamos podido hablar de esto. Siempre puedes volver cuando necesites, estaré aquí para ti 🤗",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate Aira typing
    setTimeout(() => {
      const airaResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAiraResponse(inputMessage),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, airaResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const quickReplies = [
    "Me siento abrumada",
    "Necesito motivación",
    "¿Cómo empiezo?",
    "Tengo un mal día",
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

        {/* Messages Container */}
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
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  message.isUser
                    ? styles.userMessageRow
                    : styles.airaMessageRow,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.isUser
                      ? styles.userMessageBubble
                      : styles.airaMessageBubble,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.messageText,
                      message.isUser
                        ? styles.userMessageText
                        : styles.airaMessageText,
                    ]}
                  >
                    {message.text}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.messageTime,
                      message.isUser
                        ? styles.userMessageTime
                        : styles.airaMessageTime,
                    ]}
                  >
                    {formatTime(message.timestamp)}
                  </ThemedText>
                </View>
              </View>
            ))}

            {isTyping && (
              <View style={styles.typingContainer}>
                <View style={styles.typingBubble}>
                  <View style={styles.typingDots}>
                    <View style={[styles.typingDot, styles.typingDot1]} />
                    <View style={[styles.typingDot, styles.typingDot2]} />
                    <View style={[styles.typingDot, styles.typingDot3]} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Quick Replies */}
        <View style={styles.quickRepliesContainer}>
          <ThemedText style={styles.quickRepliesTitle}>
            O puedes elegir:
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRepliesContent}
          >
            {quickReplies.map((reply, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickReplyButton}
                onPress={() => setInputMessage(reply)}
              >
                <ThemedText style={styles.quickReplyText}>{reply}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Escríbeme lo que sientes..."
            placeholderTextColor={AiraColors.mutedForeground}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputMessage.trim() || isTyping) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
          >
            <Ionicons
              name="send"
              size={20}
              color={
                !inputMessage.trim() || isTyping
                  ? AiraColors.mutedForeground
                  : "#fff"
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.card,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: AiraColors.card,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: AiraColors.mutedForeground,
    fontSize: 16,
    marginBottom: 8,
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
  messageRow: {
    marginBottom: 16,
    flexDirection: "row",
  },
  userMessageRow: {
    justifyContent: "flex-end",
  },
  airaMessageRow: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessageBubble: {
    backgroundColor: AiraColors.primary,
    borderBottomRightRadius: 4,
  },
  airaMessageBubble: {
    backgroundColor: AiraColors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.4),
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: AiraColors.primaryForeground,
  },
  airaMessageText: {
    color: AiraColors.foreground,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  userMessageTime: {
    color: AiraColorsWithAlpha.primaryForegroundWithOpacity(0.6),
  },
  airaMessageTime: {
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.6),
  },
  typingContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.tagRadius,
    padding: 14,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.4),
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: "row",
    width: 40,
    justifyContent: "space-between",
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: AiraVariants.tagRadius,
    backgroundColor: AiraColors.primary,
  },
  typingDot1: {
    opacity: 0.6,
  },
  typingDot2: {
    opacity: 0.8,
  },
  typingDot3: {
    opacity: 1,
  },
  quickRepliesContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  quickRepliesTitle: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 8,
  },
  quickRepliesContent: {
    flexDirection: "row",
    paddingBottom: 4,
  },
  quickReplyButton: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.tagRadius,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.4),
  },
  quickReplyText: {
    fontSize: 13,
    color: AiraColors.foreground,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AiraColors.card,
    borderTopWidth: 1,
    borderTopColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: AiraColors.background,
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    maxHeight: 120,
    color: AiraColors.foreground,
    fontFamily: "Montserrat",
  },
  sendButton: {
    backgroundColor: AiraColors.primary,
    width: 40,
    height: 40,
    borderRadius: AiraVariants.tagRadius,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.5),
  },
});
