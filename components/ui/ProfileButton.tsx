import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

export function ProfileButton() {
  const router = useRouter();

  const handleProfilePress = () => {
    router.push("/dashboard/profile");
  };

  return (
    <TouchableOpacity
      style={styles.profileButton}
      onPress={handleProfilePress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={22} color={AiraColors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.cardWithOpacity(0.6),
    padding: 1,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.4),
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: AiraVariants.tagRadius,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.2),
    alignItems: "center",
    justifyContent: "center",
  },
});
