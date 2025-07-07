import React from "react";
import { ColorValue, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

interface PlanOptionCardProps {
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: "gradient" | "outline";
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  disabled?: boolean;
}

export const PlanOptionCard: React.FC<PlanOptionCardProps> = ({
  title,
  description,
  iconName,
  onPress,
  variant = "gradient",
  gradientColors = ["#F97316", "#EA580C"],
  disabled = false,
}) => {
  if (variant === "gradient") {
    return (
      <TouchableOpacity
        style={styles.optionCard}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <LinearGradient colors={gradientColors} style={styles.optionGradient}>
          {iconName && <Ionicons name={iconName} size={32} color="white" />}
          <ThemedText style={styles.optionTitle}>{title}</ThemedText>
          <ThemedText style={styles.optionDescription}>
            {description}
          </ThemedText>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.optionOutline, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {iconName && (
        <Ionicons name={iconName} size={32} color={gradientColors[0]} />
      )}
      <ThemedText
        style={[styles.optionTitleOutline, { color: gradientColors[0] }]}
      >
        {title}
      </ThemedText>
      <ThemedText style={styles.optionDescriptionOutline}>
        {description}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionCard: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  optionGradient: {
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  optionOutline: {
    padding: 24,
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#F97316",
    borderRadius: AiraVariants.cardRadius,
   
  },
  disabled: {
    opacity: 0.5,
  },
  optionTitle: {
    fontSize: 18,
     
    color: "white",
    textAlign: "center",
  },
  optionTitleOutline: {
    fontSize: 18,
     
    textAlign: "center",
  },
  optionDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
  },
  optionDescriptionOutline: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 20,
  },
});
