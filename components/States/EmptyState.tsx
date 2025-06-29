import { memo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { AiraVariants } from "@/constants/Themes";

interface EmptyResultsViewProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onPress?: () => void;
}

export const EmptyState = memo(
  ({ title, description, buttonText, onPress }: EmptyResultsViewProps) => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="search-outline"
        size={64}
        color={AiraColors.mutedForeground}
      />
      <ThemedText style={styles.emptyText}>{title}</ThemedText>
      <ThemedText style={styles.emptySubtext}>{description}</ThemedText>
      {buttonText && onPress && (
        <TouchableOpacity style={styles.retryButton} onPress={onPress}>
          <ThemedText style={styles.retryButtonText}>{buttonText}</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  )
);

// Añadir displayName para resolver error de lint
EmptyState.displayName = "EmptyState";

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
     
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
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
  },
});
