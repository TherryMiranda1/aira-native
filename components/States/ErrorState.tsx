import { memo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AiraColors } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { ThemedText } from "@/components/ThemedText";

interface ErrorResultsViewProps {
  title: string;
  description?: string;
  buttonText?: string;
  onRetry?: () => void;
}

export const ErrorState = memo(
  ({
    title,
    description,
    buttonText = "Reintentar",
    onRetry,
  }: ErrorResultsViewProps) => (
    <View style={styles.errorContainer}>
      <Ionicons
        name="alert-circle-outline"
        size={64}
        color={AiraColors.destructive}
      />
      <ThemedText style={styles.errorText}>{title}</ThemedText>
      {description && (
        <ThemedText style={styles.errorSubtext}>{description}</ThemedText>
      )}
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <ThemedText style={styles.retryButtonText}>{buttonText}</ThemedText>
      </TouchableOpacity>
    </View>
  )
);

// Añadir displayName para resolver error de lint
ErrorState.displayName = "ErrorState";

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    minHeight: 300,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    padding: 8,
    borderRadius: AiraVariants.cardRadius,
    backgroundColor: AiraColors.primary,
  },
  retryButtonText: {
    color: AiraColors.background,
    fontWeight: "600",
  },
});
