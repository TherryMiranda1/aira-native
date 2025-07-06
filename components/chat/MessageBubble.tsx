import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Message } from "@/types/Assistant";

interface MessageBubbleProps {
  message: Message;
  children?: React.ReactNode;
}

export function MessageBubble({ message, children }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasSpecialContent =
    message.recipe ||
    message.exercise ||
    message.fullRoutine ||
    message.dailyMealPlan ||
    message.motivation ||
    message.completePlan;

  return (
    <View
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
          !hasSpecialContent && styles.messageBubbleWidth,
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

        {children}

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
  );
}

const styles = StyleSheet.create({
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
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
  },
  messageBubbleWidth: {
    maxWidth: "80%",
  },
  userMessageBubble: {
    backgroundColor: AiraColors.foreground,
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
});
