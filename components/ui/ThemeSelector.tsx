import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
  useColorScheme as useSystemColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { useThemePreference } from "@/context/ThemePreferenceContext";

type ThemeMode = "light" | "dark" | "system";

interface ThemeSelectorProps {
  onThemeChange?: (theme: ThemeMode) => void;
}

export const ThemeSelector = ({ onThemeChange }: ThemeSelectorProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { themeMode, setThemeMode } = useThemePreference();
  const systemColorScheme = useSystemColorScheme();

  const themeOptions: Array<{
    value: ThemeMode;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }> = [
    { value: "light", label: "Claro", icon: "sunny" },
    { value: "dark", label: "Oscuro", icon: "moon" },
    { value: "system", label: "Sistema", icon: "phone-portrait" },
  ];

  const handleThemeChange = (theme: ThemeMode) => {
    setThemeMode(theme);
    setIsDropdownOpen(false);
    onThemeChange?.(theme);
  };

  const getCurrentIcon = () => {
    if (themeMode === "system") {
      return systemColorScheme === "dark" ? "moon" : "sunny";
    }
    return themeMode === "dark" ? "moon" : "sunny";
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsDropdownOpen(true)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={getCurrentIcon()}
          size={20}
          color={AiraColors.foreground}
        />
      </TouchableOpacity>

      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.dropdown}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  themeMode === option.value && styles.selectedOption,
                ]}
                onPress={() => handleThemeChange(option.value)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon}
                  size={18}
                  color={
                    themeMode === option.value
                      ? AiraColors.primary
                      : AiraColors.foreground
                  }
                />
                <ThemedText
                  style={[
                    styles.optionText,
                    themeMode === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </ThemedText>
                {themeMode === option.value && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={AiraColors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  trigger: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 150,
    maxWidth: 200,
    elevation: Platform.OS === "android" ? 8 : 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  selectedOption: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  selectedOptionText: {
    color: AiraColors.primary,
    fontWeight: "600",
  },
});
