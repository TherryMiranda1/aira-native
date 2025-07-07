import React, { useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ColorValue,
  ListRenderItem,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { ThemedText } from "../ThemedText";
import { OptimizedCategoryCard } from "@/components/ui/OptimizedCategoryCard";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { LibrarySection, LibraryCategory } from "@/types/biblioteca";

interface OptimizedHorizontalCarouselProps {
  section: LibrarySection;
}

const CARD_WIDTH = 280;
const CARD_MARGIN = 12;

const gradientColorsMap: { [key: string]: string[] } = {
  "from-orange-400 to-pink-400": ["#FB923C", "#F472B6"],
  "from-blue-400 to-purple-400": ["#60A5FA", "#A78BFA"],
  "from-green-400 to-teal-400": ["#4ADE80", "#2DD4BF"],
  "from-purple-400 to-indigo-400": ["#A78BFA", "#818CF8"],
  "from-pink-400 to-rose-400": ["#F472B6", "#FB7185"],
  "from-indigo-400 to-purple-400": ["#818CF8", "#A78BFA"],
};

export const OptimizedHorizontalCarousel =
  React.memo<OptimizedHorizontalCarouselProps>(({ section }) => {
    const gradientColors = useMemo(
      () => gradientColorsMap[section.gradient] || ["#60A5FA", "#A78BFA"],
      [section.gradient]
    );

    const handleViewAllPress = useCallback(() => {
      router.push(section.href as any);
    }, [section.href]);

    const keyExtractor = useCallback(
      (item: LibraryCategory) => `${section.id}-${item.id}`,
      [section.id]
    );

    const renderCategoryItem: ListRenderItem<LibraryCategory> = useCallback(
      ({ item }) => (
        <View style={styles.categoryItemContainer}>
          <OptimizedCategoryCard
            category={item}
            sectionGradient={section.gradient}
          />
        </View>
      ),
      [section.gradient]
    );

    const ItemSeparator = useCallback(
      () => <View style={styles.separator} />,
      []
    );

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={gradientColors as [ColorValue, ColorValue, ...ColorValue[]]}
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
              onPress={handleViewAllPress}
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
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            ItemSeparatorComponent={ItemSeparator}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            windowSize={3}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
            scrollEventThrottle={16}
            decelerationRate={0.98}
            disableIntervalMomentum={true}
          />
        </View>
      </View>
    );
  });

OptimizedHorizontalCarousel.displayName = "OptimizedHorizontalCarousel";

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
    paddingVertical: 16,
  },
  carouselContent: {
    paddingHorizontal: 16,
  },
  categoryItemContainer: {
    width: CARD_WIDTH,
  },
  separator: {
    width: CARD_MARGIN,
  },
});
