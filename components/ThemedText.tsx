import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { AiraColors } from "@/constants/Colors";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "defaultItalic";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  // const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color: AiraColors.foreground, fontFamily: "Montserrat" },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "defaultItalic" ? styles.defaultItalic : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultItalic: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "MontserratItalic",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "MontserratBold",
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: "MontserratBold",
  },
  subtitle: {
    fontSize: 20,
    color: AiraColors.mutedForeground,
    fontFamily: "MontserratBold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: AiraColors.primary,
  },
});
