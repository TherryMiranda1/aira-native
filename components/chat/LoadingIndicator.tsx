import React from "react";
import { View, StyleSheet } from "react-native";
import { AiraColors } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

export function LoadingIndicator() {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.typingDots}>
        <View style={[styles.typingDot, styles.typingDot1]} />
        <View style={[styles.typingDot, styles.typingDot2]} />
        <View style={[styles.typingDot, styles.typingDot3]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: 8,
  },
  typingDots: {
    flexDirection: "row",
    width: 40,
    justifyContent: "space-between",
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: AiraVariants.tagRadius,
    backgroundColor: AiraColors.primary,
  },
  typingDot1: {
    opacity: 0.6,
  },
  typingDot2: {
    opacity: 0.8,
  },
  typingDot3: {
    opacity: 1,
  },
}); 