import React from "react";
import { View, StyleSheet, TouchableOpacity, ColorValue } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { ThemedView } from "../ThemedView";

interface PlanErrorViewProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  retryText?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  useGradientButton?: boolean;
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
}

export const PlanErrorView: React.FC<PlanErrorViewProps> = ({
  title = "Error al generar el plan",
  message = "Ha ocurrido un error inesperado",
  onRetry,
  retryText = "Intentar de nuevo",
  iconName = "alert-circle",
  useGradientButton = true,
  gradientColors = ["#F97316", "#EA580C"],
}) => {
  const renderRetryButton = () => {
    if (useGradientButton) {
      return (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <LinearGradient
            colors={gradientColors}
            style={styles.retryButtonGradient}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <ThemedText style={styles.retryButtonText}>{retryText}</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.retryButtonPlain} onPress={onRetry}>
        <Ionicons name="refresh" size={20} color={AiraColors.primary} />
        <ThemedText style={styles.retryButtonTextPlain}>{retryText}</ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView variant="border" style={styles.errorCard}>
        <Ionicons name={iconName} size={48} color={AiraColors.destructive} />
        <ThemedText style={styles.errorTitle}>{title}</ThemedText>
        <ThemedText style={styles.errorMessage}>{message}</ThemedText>
        {renderRetryButton()}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorCard: {
    alignItems: "center",

    borderRadius: 16,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorTitle: {
    fontSize: 20,

     
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  retryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,

    color: "white",
  },
  retryButtonPlain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
    backgroundColor: AiraColors.primary + "20",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AiraColors.primary,
  },
  retryButtonTextPlain: {
    fontSize: 16,

    color: AiraColors.primary,
  },
});
