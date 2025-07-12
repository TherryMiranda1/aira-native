import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CreateCommentInputProps {
  postId: string;
  onCommentCreated: (comment: any) => void;
  onSubmit: (data: { postId: string; contenido: string }) => Promise<any>;
}

export function CreateCommentInput({
  postId,
  onCommentCreated,
  onSubmit,
}: CreateCommentInputProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const primary = useThemeColor({}, "primary");
  const muted = useThemeColor({}, "muted");
  const foreground = useThemeColor({}, "foreground");

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      const comment = await onSubmit({
        postId,
        contenido: content.trim(),
      });

      if (comment) {
        onCommentCreated(comment);
        setContent("");
      }
    } catch (error) {
      console.error("Error al crear comentario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView variant="secondary" style={styles.container} border>
      <TextInput
        style={[styles.input, { color: foreground }]}
        placeholder="Añadir un comentario..."
        placeholderTextColor={muted}
        value={content}
        onChangeText={setContent}
        multiline
        maxLength={500}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          {
            backgroundColor: content.trim() ? primary : muted,
          },
        ]}
        onPress={handleSubmit}
        disabled={isLoading || !content.trim()}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Feather name="send" size={18} color="white" />
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
