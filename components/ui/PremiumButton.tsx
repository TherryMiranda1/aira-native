import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ThemedText } from "../ThemedText";
import { AiraColors } from "@/constants/Colors";

interface PremiumButtonProps {
  size?: "small" | "medium";
  showText?: boolean;
}

export const PremiumButton = ({ 
  size = "small", 
  showText = false 
}: PremiumButtonProps) => {
  const handlePress = () => {
    router.push("/dashboard/premium-plans");
  };

  if (size === "small") {
    return (
      <TouchableOpacity onPress={handlePress} style={styles.smallButton}>
        <LinearGradient
          colors={["#F59E0B", "#F97316"]}
          style={styles.smallGradient}
        >
          <Ionicons name="diamond" size={16} color={AiraColors.background} />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.mediumButton}>
      <LinearGradient
        colors={["#F59E0B", "#F97316"]}
        style={styles.mediumGradient}
      >
        <Ionicons name="diamond" size={20} color={AiraColors.background} />
        {showText && (
          <ThemedText style={styles.buttonText}>Premium</ThemedText>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  smallButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  smallGradient: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  mediumButton: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  mediumGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    color: AiraColors.background,
    fontWeight: "600",
  },
}); 