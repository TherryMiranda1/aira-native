import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { getIconById } from "./IconSelector";

interface EventIconProps {
  iconId?: string;
  size?: number;
  style?: any;
}

export const EventIcon: React.FC<EventIconProps> = ({
  iconId,
  size = 20,
  style,
}) => {
  const icon = iconId ? getIconById(iconId) : null;
  const emoji = icon?.emoji || "📝";

  return (
    <View style={[styles.container, style]}>
      <ThemedText style={[styles.emoji, { fontSize: size }]}>
        {emoji}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    textAlign: "center",
  },
}); 