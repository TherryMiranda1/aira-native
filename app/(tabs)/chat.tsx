import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { PageView } from "@/components/ui/PageView";
import { useHealthAgent } from "@/hooks/useHealthAgent";

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

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    processUserMessage(inputMessage);
    setInputMessage("");
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessageContent = (message: any) => {
    if (message.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <View style={styles.typingDots}>
            <View style={[styles.typingDot, styles.typingDot1]} />
            <View style={[styles.typingDot, styles.typingDot2]} />
            <View style={[styles.typingDot, styles.typingDot3]} />
          </View>
        </View>
      );
    }

    if (message.recipe) {
      return (
        <View style={styles.contentCard}>
          <ThemedText style={styles.contentTitle}>
            🍳 {message.recipe.recipeName || "Receta Sugerida"}
          </ThemedText>
          {message.recipe.reason && (
            <ThemedText style={styles.contentDescription}>
              {message.recipe.reason}
            </ThemedText>
          )}
          {message.recipe.ingredients && (
            <View style={styles.contentSection}>
              <ThemedText style={styles.contentSectionTitle}>
                Ingredientes:
              </ThemedText>
              <ThemedText style={styles.contentText}>
                {message.recipe.ingredients}
              </ThemedText>
            </View>
          )}
          {message.recipe.instructions && (
            <View style={styles.contentSection}>
              <ThemedText style={styles.contentSectionTitle}>
                Preparación:
              </ThemedText>
              <ThemedText style={styles.contentText}>
                {message.recipe.instructions}
              </ThemedText>
            </View>
          )}
          {message.recipe.estimatedTime && (
            <ThemedText style={styles.contentTime}>
              ⏱️ Tiempo estimado: {message.recipe.estimatedTime}
            </ThemedText>
          )}
        </View>
      );
    }

    if (message.exercise) {
      return (
        <View style={styles.contentCard}>
          <ThemedText style={styles.contentTitle}>
            💪 {message.exercise.exerciseName || "Ejercicio Sugerido"}
          </ThemedText>
          {message.exercise.benefits && (
            <ThemedText style={styles.contentDescription}>
              {message.exercise.benefits}
            </ThemedText>
          )}
          {message.exercise.instructions && (
            <View style={styles.contentSection}>
              <ThemedText style={styles.contentSectionTitle}>
                Instrucciones:
              </ThemedText>
              <ThemedText style={styles.contentText}>
                {message.exercise.instructions}
              </ThemedText>
            </View>
          )}
        </View>
      );
    }

    if (message.fullRoutine) {
      return (
        <View style={styles.contentCard}>
          <ThemedText style={styles.contentTitle}>
            🏋️‍♀️ {message.fullRoutine.nombreRutina}
          </ThemedText>
          <ThemedText style={styles.contentDescription}>
            {message.fullRoutine.descripcionGeneral}
          </ThemedText>
          {message.fullRoutine.sesiones?.map((sesion: any, index: number) => (
            <View key={index} style={styles.contentSection}>
              <ThemedText style={styles.contentSectionTitle}>
                {sesion.nombreSesion}
              </ThemedText>
              {sesion.ejercicios
                ?.slice(0, 3)
                .map((ejercicio: any, ejIndex: number) => (
                  <ThemedText key={ejIndex} style={styles.contentText}>
                    • {ejercicio.nombreEjercicio} -{" "}
                    {ejercicio.seriesRepeticiones}
                  </ThemedText>
                ))}
              {sesion.ejercicios?.length > 3 && (
                <ThemedText style={styles.contentText}>
                  ... y {sesion.ejercicios.length - 3} ejercicios más
                </ThemedText>
              )}
            </View>
          ))}
        </View>
      );
    }

    if (message.dailyMealPlan) {
      return (
        <View style={styles.contentCard}>
          <ThemedText style={styles.contentTitle}>
            🥗 {message.dailyMealPlan.planTitle}
          </ThemedText>
          {message.dailyMealPlan.introduction && (
            <ThemedText style={styles.contentDescription}>
              {message.dailyMealPlan.introduction}
            </ThemedText>
          )}
          {message.dailyMealPlan.meals?.map((meal: any, index: number) => (
            <View key={index} style={styles.contentSection}>
              <ThemedText style={styles.contentSectionTitle}>
                {meal.mealType}
              </ThemedText>
              {meal.options
                ?.slice(0, 2)
                .map((option: string, optIndex: number) => (
                  <ThemedText key={optIndex} style={styles.contentText}>
                    • {option}
                  </ThemedText>
                ))}
            </View>
          ))}
          {message.dailyMealPlan.generalTips && (
            <View style={styles.contentSection}>
              <ThemedText style={styles.contentSectionTitle}>
                Consejos:
              </ThemedText>
              <ThemedText style={styles.contentText}>
                {message.dailyMealPlan.generalTips}
              </ThemedText>
            </View>
          )}
        </View>
      );
    }

    return null;
  };

  const quickReplies = [
    "Me siento abrumada",
    "Necesito motivación",
    "¿Cómo empiezo?",
    "Tengo un mal día",
  ];

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
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  message.sender === "user"
                    ? styles.userMessageRow
                    : styles.airaMessageRow,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.sender === "user"
                      ? styles.userMessageBubble
                      : styles.airaMessageBubble,
                  ]}
                >
                  {message.text && (
                    <ThemedText
                      style={[
                        styles.messageText,
                        message.sender === "user"
                          ? styles.userMessageText
                          : styles.airaMessageText,
                      ]}
                    >
                      {message.text}
                    </ThemedText>
                  )}

                  {renderMessageContent(message)}

                  <ThemedText
                    style={[
                      styles.messageTime,
                      message.sender === "user"
                        ? styles.userMessageTime
                        : styles.airaMessageTime,
                    ]}
                  >
                    {formatTime(message.timestamp)}
                  </ThemedText>
                </View>
              </View>
            ))}

            {(() => {
              const lastMessage = messages[messages.length - 1];
              const options = lastMessage?.options;
              return (
                options &&
                options.length > 0 && (
                  <View style={styles.optionsContainer}>
                    <ThemedText style={styles.optionsTitle}>
                      Puedes elegir:
                    </ThemedText>
                    {options.map((option, index) => (
                      <TouchableOpacity
                        key={option.id}
                        style={styles.optionButton}
                        onPress={() => handleOptionClick(option.action)}
                      >
                        <ThemedText style={styles.optionText}>
                          {option.label}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )
              );
            })()}
          </ScrollView>
        </View>

        {messages.length === 0 && (
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
                  onPress={() => handleQuickReply(reply)}
                >
                  <ThemedText style={styles.quickReplyText}>{reply}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputContainer}>
          <ThemedInput
            variant="textarea"
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Escríbeme lo que sientes..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputMessage.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            <Ionicons
              name="send"
              size={20}
              color={
                !inputMessage.trim() || isLoading
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
  },
  userMessageBubble: {
    backgroundColor: AiraColors.primary,
    borderBottomRightRadius: 4,
  },
  airaMessageBubble: {
    backgroundColor: AiraColors.secondary,
    borderBottomLeftRadius: 4,
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
  loadingContainer: {
    paddingVertical: 8,
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
  contentCard: {
    marginTop: 8,
    padding: 12,
    backgroundColor: AiraColors.secondary,
    borderRadius: AiraVariants.cardRadius,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  contentDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 8,
    fontStyle: "italic",
  },
  contentSection: {
    marginBottom: 8,
  },
  contentSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  contentText: {
    fontSize: 13,
    color: AiraColors.foreground,
    lineHeight: 18,
  },
  contentTime: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    fontStyle: "italic",
    marginTop: 4,
  },
  optionsContainer: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  optionsTitle: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 8,
  },
  optionButton: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.tagRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.4),
  },
  optionText: {
    fontSize: 14,
    color: AiraColors.foreground,
    textAlign: "center",
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
