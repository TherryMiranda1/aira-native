import React from "react";
import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { AiraColors } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  variant?:
    | "default"
    | "search"
    | "textarea"
    | "numeric"
    | "password"
    | "minimal"
    | "borderBottom";
  hasError?: boolean;
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  variant = "default",
  hasError = false,
  placeholderTextColor,
  ...rest
}: ThemedInputProps) {
  const variantStyle = styles[variant] || styles.default;
  const errorStyle = hasError ? styles.error : {};

  return (
    <TextInput
      style={[styles.base, variantStyle, errorStyle, style]}
      placeholderTextColor={placeholderTextColor || AiraColors.mutedForeground}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "Montserrat",
    fontSize: 16,
    color: AiraColors.foreground,
    backgroundColor: AiraColors.secondary,
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  default: {
    // Estilo base ya incluido
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: AiraColors.secondary,
  },
  search: {
    backgroundColor: AiraColors.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  numeric: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  password: {
    // Mismo que default, se puede personalizar si es necesario
  },
  minimal: {
    backgroundColor: AiraColors.secondary,
    borderWidth: 0,
    borderRadius: 8,
  },
  error: {
    borderColor: AiraColors.destructive,
    borderWidth: 1,
  },
});
