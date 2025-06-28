import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ColorValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "../ThemedText";
import { CategoryCard } from "./CategoryCard";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { LibrarySection } from "@/types/biblioteca";
import { router } from "expo-router";

interface HorizontalCarouselProps {
  section: LibrarySection;
}

export const HorizontalCarousel = ({ section }: HorizontalCarouselProps) => {
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

  const renderCategoryItem = ({ item }: { item: any }) => (
    <View style={styles.categoryItem}>
      <CategoryCard category={item} sectionGradient={section.gradient} />
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          getGradientColors(section.gradient) as [
            ColorValue,
            ColorValue,
            ...ColorValue[]
          ]
        }
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={section.icon}
                size={24}
                color={AiraColors.background}
              />
            </View>
            <View style={styles.headerText}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                {section.title}
              </ThemedText>
              <ThemedText style={styles.sectionDescription}>
                {section.description}
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push(section.href as any)}
            style={styles.viewAllButton}
          >
            <ThemedText style={styles.viewAllText}>Ver todo</ThemedText>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={AiraColors.background}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.carouselContainer}>
        <FlatList
          data={section.categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    color: AiraColors.background,
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 12,
    color: AiraColorsWithAlpha.backgroundWithOpacity(0.8),
    lineHeight: 16,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewAllText: {
    fontSize: 12,
    color: AiraColors.background,
     
    marginRight: 4,
  },
  carouselContainer: {
    backgroundColor: AiraColors.card,
    paddingVertical: 16,
  },
  carouselContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    width: 280,
  },
  separator: {
    width: 12,
  },
});
