import React, { forwardRef } from "react";
import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { AiraColors } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { useThemeColor } from "@/hooks/useThemeColor";

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

export const ThemedInput = forwardRef<TextInput, ThemedInputProps>(
  (
    {
      style,
      lightColor,
      darkColor,
      variant = "default",
      hasError = false,
      placeholderTextColor,
      ...rest
    },
    ref
  ) => {
    const variantStyle = styles[variant] || styles.default;
    const errorStyle = hasError ? styles.error : {};
    const placeholderText = useThemeColor({}, "muted");
    const foreground = useThemeColor({}, "foreground");
    const background = useThemeColor({}, "secondary");

    return (
      <TextInput
        ref={ref}
        style={[
          styles.base,
          variantStyle,
          errorStyle,
          style,
          { backgroundColor: background, color: foreground },
        ]}
        placeholderTextColor={placeholderTextColor || placeholderText}
        {...rest}
      />
    );
  }
);

ThemedInput.displayName = "ThemedInput";

const styles = StyleSheet.create({
  base: {
    fontFamily: "Montserrat",
    fontSize: 16,
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 12,
    paddingVertical: 16,
    flex: 1,
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
