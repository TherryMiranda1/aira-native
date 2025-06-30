import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedInput } from "@/components/ThemedInput";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  value, 
  onChangeText, 
  onSend, 
  isLoading,
  placeholder = "Escríbeme lo que sientes..."
}: ChatInputProps) {
  const canSend = value.trim() && !isLoading;

  return (
    <View style={styles.inputContainer}>
      <ThemedInput
        variant="textarea"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline
        maxLength={500}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          !canSend && styles.sendButtonDisabled,
        ]}
        onPress={onSend}
        disabled={!canSend}
      >
        <Ionicons
          name="send"
          size={20}
          color={
            !canSend
              ? AiraColors.mutedForeground
              : "#fff"
          }
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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