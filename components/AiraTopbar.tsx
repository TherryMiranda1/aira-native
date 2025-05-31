import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

interface AiraTopbarProps {
  title?: string;
  showProfileButton?: boolean;
}

export function AiraTopbar({
  title = "Aira",
  showProfileButton = true,
}: AiraTopbarProps) {
  const router = useRouter();

  const handleProfilePress = () => {
    router.push("/profile");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title} type="title">
            {title}
          </ThemedText>
        </View>

        <View style={styles.actions}>
          {showProfileButton && (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={14} color={AiraColors.primary} />
              </View>
              <ThemedText style={styles.profileText}>Mi perfil</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.8),
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.cardWithOpacity(0.6),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.4),
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: AiraVariants.tagRadius,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.2),
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  profileText: {
    fontSize: 13,
  },
});
