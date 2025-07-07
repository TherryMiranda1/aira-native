import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, ViewStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export interface PageViewProps {
  children: React.ReactNode;
  variant?: "background" | "secondary";
  style?: ViewStyle;
}

export const PageView = ({ children, variant = "background", style }: PageViewProps) => {
  const backgroundColor = useThemeColor({}, variant);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});
