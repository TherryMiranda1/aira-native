import {
  useSafeAreaInsets
} from "react-native-safe-area-context";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export interface PageViewProps {
  children: React.ReactNode;
  variant?: "background" | "secondary";
  style?: ViewStyle;
  safeAreaBottom?: boolean;
  safeAreaTop?: boolean;
}

export const PageView = ({
  children,
  variant = "background",
  style,
  safeAreaBottom = true,
  safeAreaTop = true,
}: PageViewProps) => {
  const backgroundColor = useThemeColor({}, variant);
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: safeAreaTop ? insets.top : 0,
          paddingBottom: safeAreaBottom ? insets.bottom : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
