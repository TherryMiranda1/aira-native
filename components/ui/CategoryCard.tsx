import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  ColorValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { LibraryCategory } from "@/types/biblioteca";

interface CategoryCardProps {
  category: LibraryCategory;
  sectionGradient: string;
  isActive?: boolean;
  featured?: boolean;
  onPress?: () => void;
}

export const CategoryCard = ({
  category,
  sectionGradient,
  isActive = false,
  featured = false,
  onPress,
}: CategoryCardProps) => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim1 = useRef(new Animated.Value(0)).current;
  const shimmerAnim2 = useRef(new Animated.Value(0)).current;

  const getGradientColors = (gradient: string) => {
    const colorMap: { [key: string]: string[] } = {
      "from-orange-400 to-pink-400": ["#FB923C", "#F472B6"],
      "from-blue-400 to-purple-400": ["#60A5FA", "#A78BFA"],
      "from-green-400 to-teal-400": ["#4ADE80", "#2DD4BF"],
      "from-purple-400 to-indigo-400": ["#A78BFA", "#818CF8"],
      "from-pink-400 to-rose-400": ["#F472B6", "#FB7185"],
      "from-indigo-400 to-purple-400": ["#818CF8", "#A78BFA"],
    };
    return colorMap[gradient] || ["#60A5FA", "#A78BFA"];
  };

  const startShimmerAnimation = () => {
    const shimmerSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim1, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim2, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim1, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim2, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerSequence.start();
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    startShimmerAnimation();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navegación específica basada en la categoría
      if (category.href) {
        // Si es una categoría de frases inspiradoras y ya tiene parámetro de categoría
        if (category.href.includes("/inspiration/frases")) {
          // Si ya tiene parámetro category, usar la URL tal como está
          if (category.href.includes("?category=")) {
            router.push(
              category.href.replace("?category=", "?categoria=") as any
            );
          } else {
            // Si no tiene parámetro, navegar a la página general
            router.push(category.href as any);
          }
        } else if (category.href.includes("/inspiration/mini-retos")) {
          // Si es una categoría de mini-retos y ya tiene parámetro de categoría
          if (category.href.includes("?category=")) {
            router.push(
              category.href.replace("?category=", "?categoria=") as any
            );
          } else {
            // Si no tiene parámetro, navegar a la página general
            router.push(category.href as any);
          }
        } else if (category.href.includes("/inspiration/rituales")) {
          // Si es una categoría de rituales y ya tiene parámetro de categoría
          if (category.href.includes("?category=")) {
            router.push(
              category.href.replace("?category=", "?categoria=") as any
            );
          } else {
            // Si no tiene parámetro, navegar a la página general
            router.push(category.href as any);
          }
        } else {
          // Para otras categorías, navegación normal
          router.push(category.href as any);
        }
      } else {
        console.log("Navegando a:", category.title);
      }
    }
  };

  const cardStyle = [
    styles.card,
    isActive && styles.activeCard,
    featured && styles.featuredCard,
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={cardStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
      >
        <View style={styles.imageContainer}>
          {/* Imagen de fondo */}
          <Image
            source={{
              uri: category.image,
            }}
            style={styles.backgroundImage}
            onError={() => {
              // Fallback a logo de Aira si la imagen no carga
              console.log("Error loading image, using fallback");
            }}
          />

          {/* Overlay de gradiente */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            locations={[0, 1]}
            style={styles.gradientOverlay}
          />

          {/* Badge para destacados */}
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

          {/* Contenido sobre la imagen */}
          <View style={styles.contentOverlay}>
            <View style={styles.contentRow}>
              {/* Icono con gradiente de sección */}
              <LinearGradient
                colors={
                  getGradientColors(sectionGradient) as [
                    ColorValue,
                    ColorValue,
                    ...ColorValue[]
                  ]
                }
                style={styles.iconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={category.icon} size={20} color="white" />
              </LinearGradient>

              {/* Texto */}
              <View style={styles.textContainer}>
                <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={2}>
                  {category.title}
                </ThemedText>
                {category.description && (
                  <ThemedText style={styles.description} numberOfLines={2}>
                    {category.description}
                  </ThemedText>
                )}
              </View>
            </View>
          </View>

          {/* Hover effect overlay */}
          <LinearGradient
            colors={["rgba(139, 92, 246, 0)", "rgba(139, 92, 246, 0.05)"]}
            style={styles.hoverOverlay}
          />

          {/* Efectos shimmer */}
          <Animated.View
            style={[
              styles.shimmerDot1,
              {
                opacity: shimmerAnim1,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.shimmerDot2,
              {
                opacity: shimmerAnim2,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.9),
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: AiraColors.foreground,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 0,
  },
  activeCard: {
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.5),
  },
  featuredCard: {
    borderWidth: 1,
    borderColor: AiraColors.secondary,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 16 / 9, // aspect-video del web
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    zIndex: 10,
  },
  featuredBadgeText: {
    color: "white",
    fontSize: 12,
  },
  contentOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: "white",
    lineHeight: 22,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 18,
    marginTop: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  hoverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  shimmerDot1: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 4,
    height: 4,
    backgroundColor: "white",
    borderRadius: 2,
  },
  shimmerDot2: {
    position: "absolute",
    bottom: 32,
    left: 32,
    width: 2,
    height: 2,
    backgroundColor: "white",
    borderRadius: 1,
  },
});
