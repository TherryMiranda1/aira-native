import { ScrollView, ScrollViewProps } from "react-native";


export type ThemedViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedScrollView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  return (
    <ScrollView
      style={[{ backgroundColor: "transparent" }, style]}
      {...otherProps}
    />
  );
}
