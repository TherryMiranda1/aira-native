import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { View } from "react-native";

export default function TabBarBackground() {
  return <View style={{ backgroundColor: "white" }} />;
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
