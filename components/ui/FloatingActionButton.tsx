import React, { memo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AiraColors } from "@/constants/Colors";
import { SHADOWS } from "@/constants/Shadows";
import { AiraVariants } from "@/constants/Themes";

interface FloatingActionButtonProps {
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  disabled?: boolean;
  bottomPadding?: number;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary";
}

const SIZES = {
  small: 48,
  medium: 56,
  large: 64,
} as const;

const ICON_SIZES = {
  small: 20,
  medium: 24,
  large: 28,
} as const;

const FloatingActionButtonComponent: React.FC<FloatingActionButtonProps> = ({
  onPress,
  iconName,
  style,
  disabled = false,
  bottomPadding = 0,
  size = "medium",
  variant = "primary",
}) => {
  const buttonSize = SIZES[size];
  const iconSize = ICON_SIZES[size];
  const isPrimary = variant === "primary";

  const backgroundColor = disabled 
    ? AiraColors.muted 
    : isPrimary 
      ? AiraColors.foreground 
      : AiraColors.background;
      
  const iconColor = disabled 
    ? AiraColors.mutedForeground 
    : isPrimary 
      ? AiraColors.card 
      : AiraColors.foreground;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          bottom: bottomPadding + 16,
          backgroundColor,
          borderWidth: isPrimary ? 0 : 1,
          borderColor: isPrimary ? "transparent" : AiraColors.border,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Botón ${iconName}`}
      accessibilityState={{ disabled }}
    >
      <Ionicons
        name={iconName}
        size={iconSize}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

export const FloatingActionButton = memo(FloatingActionButtonComponent);

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: AiraVariants.cardRadius,
    zIndex: 1000,
    ...SHADOWS[4],
    ...(Platform.OS === "android" && { elevation: 8 }),
  },
});
