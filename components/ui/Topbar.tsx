import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ThemeSelector } from "./ThemeSelector";

interface TopbarProps {
  title: string;
  actions?: React.ReactNode;
  leftActions?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  showThemeSelector?: boolean;
}

export const Topbar = ({
  title,
  actions,
  leftActions,
  showBackButton = false,
  onBack,
  showThemeSelector = false,
}: TopbarProps) => {
  const router = useRouter();

  const renderLeftActions = () => {
    if (leftActions) {
      return leftActions;
    }
    return showBackButton ? (
      <TouchableOpacity onPress={onBack ? onBack : () => router.back()}>
        <Ionicons name="arrow-back" size={24} color={AiraColors.foreground} />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={() => router.replace("/")}>
        <Image
          source={require("../../assets/images/aira-logo.png")}
          style={styles.logo}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.topbarContent}>
        {renderLeftActions()}
        <ThemedText numberOfLines={1} style={styles.topbarTitle} type="title">
          {title}
        </ThemedText>
        <View style={styles.topbarActions}>
          {showThemeSelector && <ThemeSelector />}
          {actions}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topbarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: AiraColors.card,
    borderBottomWidth: 1,
    paddingVertical: 4,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
    paddingHorizontal: 16,
  },
  topbarTitle: {
    fontSize: 18,
    padding: 4,
    maxWidth: "60%",
  },
  topbarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
});
