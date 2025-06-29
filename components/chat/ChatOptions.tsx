import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { AgentOption, AgentOptionAction } from "@/types/Assistant";

interface ChatOptionsProps {
  options: AgentOption[];
  onOptionClick: (action: AgentOptionAction) => void;
}

export function ChatOptions({ options, onOptionClick }: ChatOptionsProps) {
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <View style={styles.optionsContainer}>
      <ThemedText style={styles.optionsTitle}>
        Puedes elegir:
      </ThemedText>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.optionButton}
          onPress={() => onOptionClick(option.action)}
        >
          <ThemedText style={styles.optionText}>
            {option.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
}); 