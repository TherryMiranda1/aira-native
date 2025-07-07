import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewVariant =
  | "background"
  | "secondary"
  | "foreground"
  | "primary"
  | "border";

export type ThemedViewProps = ViewProps & {
  variant?: ThemedViewVariant;
  border?: boolean;
};

export function ThemedView({
  style,
  variant = "background",
  border = false,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({}, variant);
  const borderColor = useThemeColor({}, "border");

  return (
    <View
      style={[
        { backgroundColor, borderColor, borderWidth: border ? 1 : 0 },
        style,
      ]}
      {...otherProps}
    />
  );
}
