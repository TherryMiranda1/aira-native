import React, { useCallback, useRef, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ListRenderItem,
  ViewToken,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.85;
const CARD_MARGIN = 16;

interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
  benefits: string[];
  isHighlighted?: boolean;
}

interface PremiumCarouselProps {
  features: PremiumFeature[];
  selectedPlan: string;
  onFeaturePress?: (feature: PremiumFeature) => void;
}

const PremiumFeatureCard = React.memo<{
  feature: PremiumFeature;
  isActive: boolean;
  onPress: () => void;
  selectedPlan: string;
}>(({ feature, isActive, onPress, selectedPlan }) => {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.95)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1 : 0.95,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [isActive, scaleAnim]);

  const isSelected = feature.id === selectedPlan;

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[styles.card, isSelected && styles.selectedCard]}
      >
        <LinearGradient
          colors={feature.gradient as [string, string, string]}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {feature.isHighlighted && (
            <View style={styles.highlightBadge}>
              <ThemedText style={styles.highlightText}>Más Popular</ThemedText>
            </View>
          )}

          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={feature.icon}
                size={32}
                color={AiraColors.background}
              />
            </View>
            <View style={styles.headerText}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                {feature.title}
              </ThemedText>
              <ThemedText style={styles.cardDescription}>
                {feature.description}
              </ThemedText>
            </View>
          </View>

          <View style={styles.benefitsContainer}>
            {feature.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={AiraColors.background}
                />
                <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
              </View>
            ))}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

PremiumFeatureCard.displayName = "PremiumFeatureCard";

export const PremiumCarousel = React.memo<PremiumCarouselProps>(
  ({ features, onFeaturePress, selectedPlan }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useCallback(
      ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
          setActiveIndex(viewableItems[0].index || 0);
        }
      },
      []
    );

    const viewabilityConfig = {
      itemVisiblePercentThreshold: 50,
    };

    const keyExtractor = useCallback((item: PremiumFeature) => item.id, []);

    const renderFeatureItem: ListRenderItem<PremiumFeature> = useCallback(
      ({ item, index }) => (
        <PremiumFeatureCard
          feature={item}
          isActive={index === activeIndex}
          onPress={() => onFeaturePress?.(item)}
          selectedPlan={selectedPlan}
        />
      ),
      [activeIndex, onFeaturePress, selectedPlan]
    );

    const ItemSeparator = useCallback(
      () => <View style={styles.separator} />,
      []
    );

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Beneficios Premium
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Desbloquea todo el potencial de Aira
          </ThemedText>
        </View>

        <FlatList
          ref={flatListRef}
          data={features}
          renderItem={renderFeatureItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          ItemSeparatorComponent={ItemSeparator}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          snapToInterval={CARD_WIDTH + CARD_MARGIN}
          decelerationRate="fast"
          scrollEventThrottle={16}
          pagingEnabled={false}
          removeClippedSubviews={false}
        />

        <View style={styles.pagination}>
          {features.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
              onPress={() => {
                flatListRef.current?.scrollToIndex({
                  index,
                  animated: true,
                });
              }}
            />
          ))}
        </View>
      </View>
    );
  }
);

PremiumCarousel.displayName = "PremiumCarousel";

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  carouselContent: {
    paddingHorizontal: 16,
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
  },
  cardGradient: {
    padding: 24,
    minHeight: 320,
  },
  highlightBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  highlightText: {
    fontSize: 12,
    color: AiraColors.background,
    fontWeight: "600",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  iconContainer: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    borderRadius: 16,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  headerText: {
    flex: 1,
    paddingTop: 8,
  },
  cardTitle: {
    fontSize: 20,
    color: AiraColors.background,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: AiraColorsWithAlpha.backgroundWithOpacity(0.8),
    lineHeight: 20,
  },
  benefitsContainer: {
    flex: 1,
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    color: AiraColors.background,
    flex: 1,
    lineHeight: 20,
  },
  cardFooter: {
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: AiraColors.background,
    fontWeight: "600",
  },
  separator: {
    width: CARD_MARGIN,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.3),
  },
  paginationDotActive: {
    backgroundColor: AiraColors.primary,
    width: 24,
  },
});
