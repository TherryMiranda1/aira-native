import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";

interface PlanLoadingViewProps {
  title?: string;
  subtitle?: string;
  indicatorColor?: string;
}

export const PlanLoadingView: React.FC<PlanLoadingViewProps> = ({
  title = "Generando tu plan personalizado",
  subtitle = "Aira está trabajando para crear algo especial para ti...",

  indicatorColor = AiraColors.foreground,
}) => {
  const content = (
    <>
      <ActivityIndicator size="large" color={indicatorColor} />
      <ThemedText style={[styles.loadingTitle]}>{title}</ThemedText>
      <ThemedText style={[styles.loadingSubtitle]}>{subtitle}</ThemedText>
    </>
  );

  return (
    <View style={[styles.container, styles.plainContainer]}>{content}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  plainContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: AiraColors.card,
  },
  loadingTitle: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
