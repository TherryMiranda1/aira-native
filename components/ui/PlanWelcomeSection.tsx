import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";

interface PlanWelcomeSectionProps {
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: any;
}

export const PlanWelcomeSection: React.FC<PlanWelcomeSectionProps> = ({
  title,
  description,
  iconName = "bulb",
  iconSize = 32,
  iconColor = AiraColors.primary,
  containerStyle,
}) => {
  return (
    <View style={[styles.welcomeSection, containerStyle]}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      </View>
      <ThemedText style={styles.welcomeTitle}>{title}</ThemedText>
      <ThemedText style={styles.welcomeDescription}>{description}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
  },
  welcomeDescription: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});
