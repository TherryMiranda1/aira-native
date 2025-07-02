import React, { useCallback, useMemo, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ColorValue,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { LibraryCategory } from "@/types/biblioteca";

interface OptimizedCategoryCardProps {
  category: LibraryCategory;
  sectionGradient: string;
  isActive?: boolean;
  featured?: boolean;
  onPress?: () => void;
}

const gradientColorsMap: { [key: string]: string[] } = {
  "from-orange-400 to-pink-400": ["#FB923C", "#F472B6"],
  "from-blue-400 to-purple-400": ["#60A5FA", "#A78BFA"],
  "from-green-400 to-teal-400": ["#4ADE80", "#2DD4BF"],
  "from-purple-400 to-indigo-400": ["#A78BFA", "#818CF8"],
  "from-pink-400 to-rose-400": ["#F472B6", "#FB7185"],
  "from-indigo-400 to-purple-400": ["#818CF8", "#A78BFA"],
};

export const OptimizedCategoryCard = React.memo<OptimizedCategoryCardProps>(
  ({ category, sectionGradient, isActive = false, featured = false, onPress }) => {
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const gradientColors = useMemo(
      () => gradientColorsMap[sectionGradient] || ["#60A5FA", "#A78BFA"],
      [sectionGradient]
    );

    const imageSource = useMemo(
      () => ({ uri: category.image }),
      [category.image]
    );

    const handlePressIn = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }, [scaleAnim]);

    const handlePressOut = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }, [scaleAnim]);

    const handlePress = useCallback(() => {
      if (onPress) {
        onPress();
        return;
      }

      if (!category.href) {
        console.log("Navegando a:", category.title);
        return;
      }

      let navigationUrl = category.href;

      if (category.href.includes("/inspiration/frases") && category.href.includes("?category=")) {
        navigationUrl = category.href.replace("?category=", "?categoria=");
      } else if (category.href.includes("/inspiration/mini-retos") && category.href.includes("?category=")) {
        navigationUrl = category.href.replace("?category=", "?categoria=");
      } else if (category.href.includes("/inspiration/rituales") && category.href.includes("?category=")) {
        navigationUrl = category.href.replace("?category=", "?categoria=");
      }

      router.push(navigationUrl as any);
    }, [onPress, category.href, category.title, router]);

    const cardStyle = useMemo(
      () => [
        styles.card,
        isActive && styles.activeCard,
        featured && styles.featuredCard,
      ],
      [isActive, featured]
    );

    const animatedStyle = useMemo(
      () => ({ transform: [{ scale: scaleAnim }] }),
      [scaleAnim]
    );

    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={cardStyle}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.95}
        >
          <View style={styles.imageContainer}>
            <Image
              source={imageSource}
              style={styles.backgroundImage}
              resizeMode="cover"
              onError={() => {
                console.log("Error loading image for:", category.title);
              }}
            />

            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              locations={[0, 1]}
              style={styles.gradientOverlay}
            />

            {featured && (
              <LinearGradient
                colors={["#A855F7", "#EC4899"]}
                style={styles.featuredBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <ThemedText style={styles.featuredBadgeText}>
                  Destacado
                </ThemedText>
              </LinearGradient>
            )}

            <View style={styles.contentOverlay}>
              <View style={styles.contentRow}>
                <LinearGradient
                  colors={gradientColors as [ColorValue, ColorValue, ...ColorValue[]]}
                  style={styles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name={category.icon}
                    size={20}
                    color={AiraColors.background}
                  />
                </LinearGradient>

                <View style={styles.textContent}>
                  <ThemedText 
                    type="defaultSemiBold" 
                    style={styles.title}
                    numberOfLines={2}
                  >
                    {category.title}
                  </ThemedText>
                  {category.description && (
                    <ThemedText 
                      style={styles.description}
                      numberOfLines={2}
                    >
                      {category.description}
                    </ThemedText>
                  )}
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

OptimizedCategoryCard.displayName = "OptimizedCategoryCard";

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: AiraColors.card,
    shadowColor: AiraColors.foreground,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: AiraColors.primary,
  },
  featuredCard: {
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    height: 180,
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredBadgeText: {
    fontSize: 10,
    color: AiraColors.background,
    fontWeight: "600",
  },
  contentOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconGradient: {
    borderRadius: 12,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: AiraColors.background,
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    color: AiraColorsWithAlpha.backgroundWithOpacity(0.8),
    lineHeight: 16,
  },
}); 