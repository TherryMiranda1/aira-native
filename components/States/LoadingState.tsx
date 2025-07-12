import { ActivityIndicator, StyleSheet } from "react-native";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "../ThemedView";

interface LoadingStateProps {
  title?: string;
}

export const LoadingState = ({ title = "Cargando..." }: LoadingStateProps) => {
  return (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={AiraColors.primary} />
      <ThemedText style={styles.loadingText}>{title}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    minHeight: 300,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
});
