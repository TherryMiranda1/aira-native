import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { LibraryCategory } from "@/types/biblioteca";

interface CategoryCardAlternativeProps {
  category: LibraryCategory;
  sectionGradient?: string;
  featured?: boolean;
  onPress?: () => void;
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const CategoryCardAlternative = ({
  category,
  featured = false,
  onPress,
}: CategoryCardAlternativeProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      console.log("Navegando a:", category.href);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        featured && styles.featuredCard,
        { width: featured ? width - 32 : cardWidth },
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: category.image }} style={styles.image} />
        {featured && (
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)"]}
            style={styles.imageOverlay}
          />
        )}
        <View style={styles.iconContainer}>
          <Ionicons
            name={category.icon}
            size={20}
            color={AiraColors.background}
          />
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.title} numberOfLines={2}>
          {category.title}
        </ThemedText>
        {category.description && (
          <ThemedText style={styles.description} numberOfLines={2}>
            {category.description}
          </ThemedText>
        )}
        {featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color={AiraColors.accent} />
            <ThemedText style={styles.featuredText}>Destacado</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 16,
    shadowColor: AiraColors.foreground,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  featuredCard: {
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.3),
    borderWidth: 2,
  },
  imageContainer: {
    position: "relative",
    height: 120,
    borderTopLeftRadius: AiraVariants.cardRadius,
    borderTopRightRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  iconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.9),
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
     
     
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    lineHeight: 16,
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  featuredText: {
    fontSize: 10,
    color: AiraColors.accent,
    marginLeft: 4,
     
  },
}); 