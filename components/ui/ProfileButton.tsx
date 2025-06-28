import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { ThemedText } from "@/components/ThemedText";

export function ProfileButton() {
  const router = useRouter();
  const { user } = useUser();

  const handleProfilePress = () => {
    router.push("/dashboard/profile");
  };

  const getInitial = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.charAt(0).toUpperCase();
    }
    return "U";
  };

  const renderAvatar = () => {
    if (user?.imageUrl) {
      return (
        <Image
          source={{ uri: user.imageUrl }}
          style={styles.profileImage}
          resizeMode="cover"
        />
      );
    }

    if (user?.firstName || user?.emailAddresses?.[0]?.emailAddress) {
      return (
        <ThemedText style={styles.initialText}>
          {getInitial()}
        </ThemedText>
      );
    }

    return <Ionicons name="person" size={22} color={AiraColors.primary} />;
  };

  return (
    <TouchableOpacity
      style={styles.profileButton}
      onPress={handleProfilePress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {renderAvatar()}
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
    overflow: "hidden",
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: AiraVariants.tagRadius,
  },
  initialText: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.primary,
  },
});
