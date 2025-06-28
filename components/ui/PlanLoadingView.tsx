import React from "react";
import { View, StyleSheet, ActivityIndicator, ColorValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";

interface PlanLoadingViewProps {
  title?: string;
  subtitle?: string;
  useGradient?: boolean;
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  indicatorColor?: string;
}

export const PlanLoadingView: React.FC<PlanLoadingViewProps> = ({
  title = "Generando tu plan personalizado",
  subtitle = "Aira está trabajando para crear algo especial para ti...",
  useGradient = true,
  gradientColors = ["#F97316", "#EA580C"],
  indicatorColor = "white",
}) => {
  const content = (
    <>
      <ActivityIndicator size="large" color={indicatorColor} />
      <ThemedText
        style={[
          styles.loadingTitle,
          !useGradient && { color: AiraColors.foreground },
        ]}
      >
        {title}
      </ThemedText>
      <ThemedText
        style={[
          styles.loadingSubtitle,
          !useGradient && { color: AiraColors.mutedForeground },
        ]}
      >
        {subtitle}
      </ThemedText>
    </>
  );

  if (useGradient) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientContainer}
        >
          {content}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.plainContainer]}>{content}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  plainContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: AiraColors.background,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
