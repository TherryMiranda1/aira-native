import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

type ButtonVariant = "default" | "primary" | "ghost" | "border";

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  text: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  text,
  leftIcon,
  rightIcon,
  size = "md",
  fullWidth = false,
  style,
  disabled = false,
  ...props
}) => {
  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: AiraVariants.cardRadius,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    };

    const sizeStyles: Record<string, ViewStyle> = {
      sm: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 36 },
      md: { paddingVertical: 12, paddingHorizontal: 16, minHeight: 44 },
      lg: { paddingVertical: 16, paddingHorizontal: 20, minHeight: 52 },
    };

    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      default: {
        backgroundColor: disabled ? AiraColors.muted : AiraColors.foreground,
      },
      primary: {
        backgroundColor: disabled ? AiraColors.muted : AiraColors.primary,
      },
      ghost: {
        backgroundColor: "transparent",
      },
      border: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: disabled ? AiraColors.muted : AiraColors.foreground,
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: "100%" }),
      ...(disabled && { opacity: 0.6 }),
    };
  };

  const getTextColor = (): string => {
    if (disabled) {
      return AiraColors.mutedForeground;
    }

    const textColors: Record<ButtonVariant, string> = {
      default: AiraColors.card,
      primary: AiraColors.card,
      ghost: AiraColors.foreground,
      border: AiraColors.foreground,
    };

    return textColors[variant];
  };

  const getTextType = (): "defaultSemiBold" => {
    return "defaultSemiBold";
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      {leftIcon}
      <ThemedText
        type={getTextType()}
        style={[
          styles.buttonText,
          { color: getTextColor() },
          size === "sm" && styles.smallText,
          size === "lg" && styles.largeText,
        ]}
      >
        {text}
      </ThemedText>
      {rightIcon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    textAlign: "center",
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
});
