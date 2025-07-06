import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedInput } from "@/components/ThemedInput";
import { AiraColors } from "@/constants/Colors";

interface CounselorChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function CounselorChatInput({
  onSend,
  isLoading,
  placeholder = "Escribe tu mensaje aquí...",
}: CounselorChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<TextInput>(null);

  const canSend = value.trim() && !isLoading;

  const handleSend = () => {
    if (canSend) {
      onSend(value.trim());
      setValue("");
      inputRef.current?.blur();
    }
  };

  return (
    <View style={styles.inputContainer}>
      <ThemedInput
        ref={inputRef}
        style={styles.input}
        variant="textarea"
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        multiline
        maxLength={500}
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />
      <TouchableOpacity
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!canSend}
      >
        <Ionicons
          name="send"
          size={20}
          color={!canSend ? AiraColors.mutedForeground : "#fff"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 24,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: AiraColors.card,
    borderTopWidth: 1,
    borderTopColor: AiraColors.border,
    alignItems: "flex-end",
  },
  sendButton: {
    backgroundColor: AiraColors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: AiraColors.secondary,
  },
  input: {
    flex: 1,
    minHeight: 40,
  },
});
