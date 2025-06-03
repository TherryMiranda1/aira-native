import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface TopbarProps {
  title: string;
  actions?: React.ReactNode;
  showBackButton?: boolean;
}

export const Topbar = ({
  title,
  actions,
  showBackButton = false,
}: TopbarProps) => {
  const router = useRouter();

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.topbarContent}>
        {showBackButton ? (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={AiraColors.foreground}
            />
          </TouchableOpacity>
        ) : (
          <Image
            source={require("../../assets/images/aira-logo.png")}
            style={styles.logo}
          />
        )}
        <ThemedText numberOfLines={1} style={styles.topbarTitle} type="title">
          {title}
        </ThemedText>
        <View style={styles.topbarActions}>{actions}</View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topbarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: AiraColors.card,
    borderBottomWidth: 1,
    paddingVertical: 4,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
    paddingHorizontal: 16,
  },
  topbarTitle: {
    fontSize: 20,
    padding: 4,
    maxWidth: "80%",
  },
  topbarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
});
