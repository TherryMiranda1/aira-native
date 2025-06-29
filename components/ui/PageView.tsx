import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, ViewStyle } from "react-native";
import { AiraColors } from "@/constants/Colors";

export interface PageViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const PageView = ({ children, style }: PageViewProps) => {
  return (
    <SafeAreaView style={[styles.container, style]} edges={["top"]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: AiraColors.card,
  },
});
