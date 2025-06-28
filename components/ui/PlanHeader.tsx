import React from "react";
import { View, StyleSheet, TouchableOpacity, ColorValue } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";

interface PlanHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  showBack?: boolean;
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  disabled?: boolean;
}

export const PlanHeader: React.FC<PlanHeaderProps> = ({
  title,
  subtitle,
  onBack,
  showBack = true,
  gradientColors = ["#F97316", "#EA580C"],
  disabled = false,
}) => {
  return (
    <LinearGradient colors={gradientColors} style={styles.header}>
      <SafeAreaView edges={["top"]} style={styles.headerContent}>
        <View style={styles.headerRow}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              disabled={disabled}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          <View style={styles.headerTextContainer}>
            <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
              {title}
            </ThemedText>
            {subtitle && (
              <ThemedText style={styles.headerSubtitle}>{subtitle}</ThemedText>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
});
