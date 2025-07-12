import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

interface QuickRepliesProps {
  replies: string[];
  onReplySelect: (reply: string) => void;
  visible?: boolean;
}

export function QuickReplies({ replies, onReplySelect, visible = true }: QuickRepliesProps) {
  if (!visible || !replies || replies.length === 0) {
    return null;
  }

  return (
    <View style={styles.quickRepliesContainer}>
      <ThemedText style={styles.quickRepliesTitle}>
        O puedes elegir:
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickRepliesContent}
      >
        {replies.map((reply, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickReplyButton}
            onPress={() => onReplySelect(reply)}
          >
            <ThemedText style={styles.quickReplyText}>
              {reply}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
     
  },
}); 