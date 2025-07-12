import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

const HERO_SECTION_HEIGHT = 150;
const FEATURED_SECTION_HEIGHT = 400;

interface FeedSkeletonProps {
  sectionsCount?: number;
}

const SkeletonPulse = ({
  style,
  children,
}: {
  style?: any;
  children?: React.ReactNode;
}) => {
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
};

const HeroSkeleton = () => (
  <View style={styles.heroSkeleton}>
    <SkeletonPulse style={styles.heroTextSkeleton} />
    <SkeletonPulse style={styles.heroAccentSkeleton} />
  </View>
);

const SectionSkeleton = () => (
  <View style={styles.sectionSkeleton}>
    <LinearGradient
      colors={[
        AiraColorsWithAlpha.foregroundWithOpacity(0.1),
        AiraColorsWithAlpha.foregroundWithOpacity(0.05),
      ]}
      style={styles.sectionHeader}
    >
      <View style={styles.sectionHeaderContent}>
        <View style={styles.sectionHeaderLeft}>
          <SkeletonPulse style={styles.iconSkeleton} />
          <View style={styles.headerTextSkeleton}>
            <SkeletonPulse style={styles.titleSkeleton} />
            <SkeletonPulse style={styles.subtitleSkeleton} />
          </View>
        </View>
        <SkeletonPulse style={styles.buttonSkeleton} />
      </View>
    </LinearGradient>

    <View style={styles.carouselSkeleton}>
      <View style={styles.cardsContainer}>
        {[1, 2, 3].map((index) => (
          <View key={index} style={styles.cardSkeleton}>
            <SkeletonPulse style={styles.cardImageSkeleton} />
            <View style={styles.cardContent}>
              <SkeletonPulse style={styles.cardTitleSkeleton} />
              <SkeletonPulse style={styles.cardDescriptionSkeleton} />
            </View>
          </View>
        ))}
      </View>
    </View>
  </View>
);

const FeaturedSkeleton = () => (
  <View style={styles.featuredSkeleton}>
    <View style={styles.featuredHeader}>
      <View style={styles.sectionHeaderLeft}>
        <SkeletonPulse style={styles.iconSkeleton} />
        <View style={styles.headerTextSkeleton}>
          <SkeletonPulse style={styles.titleSkeleton} />
          <SkeletonPulse style={styles.subtitleSkeleton} />
        </View>
      </View>
    </View>

    <View style={styles.featuredGrid}>
      {[1, 2].map((index) => (
        <View key={index} style={styles.featuredCardSkeleton}>
          <SkeletonPulse style={styles.featuredCardImageSkeleton} />
          <View style={styles.cardContent}>
            <SkeletonPulse style={styles.cardTitleSkeleton} />
            <SkeletonPulse style={styles.cardDescriptionSkeleton} />
          </View>
        </View>
      ))}
    </View>
  </View>
);

export const FeedSkeleton: React.FC<FeedSkeletonProps> = ({
  sectionsCount = 5,
}) => {
  return (
    <View style={styles.container}>
      <HeroSkeleton />

      {Array.from({ length: sectionsCount }, (_, index) => (
        <SectionSkeleton key={`section-skeleton-${index}`} />
      ))}

      <FeaturedSkeleton />

      <View style={styles.ctaSkeleton}>
        <SkeletonPulse style={styles.ctaContentSkeleton} />
      </View>
    </View>
  );
};

interface CounselorSkeletonProps {
  type: "sessions" | "chat";
  messagesCount?: number;
}

export const CounselorSkeleton: React.FC<CounselorSkeletonProps> = ({
  type,
  messagesCount = 3,
}) => {
  if (type === "sessions") {
    return (
      <View style={styles.counselorSessionsContainer}>
        <SkeletonPulse style={styles.sessionHeaderSkeleton} />

        {Array.from({ length: messagesCount }, (_, index) => (
          <SkeletonPulse
            key={`session-skeleton-${index}`}
            style={styles.sessionItemSkeleton}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.counselorChatContainer}>
      {Array.from({ length: messagesCount }, (_, index) => (
        <View
          key={`message-skeleton-${index}`}
          style={[styles.messageSkeleton]}
        >
          <SkeletonPulse style={styles.messageContentSkeleton} />
        </View>
      ))}

      <SkeletonPulse style={styles.inputSkeleton} />
    </View>
  );
};

export const MetricsSkeleton: React.FC<{ count?: number }> = ({
  count = 4,
}) => (
  <View style={{ flex: 1, padding: 16 }}>
    <View style={{ marginBottom: 24 }}>
      <SkeletonPulse
        style={{
          height: 28,
          width: "60%",
          borderRadius: 8,
          backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
          marginBottom: 8,
        }}
      />
      <SkeletonPulse
        style={{
          height: 18,
          width: "80%",
          borderRadius: 8,
          backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.3),
        }}
      />
    </View>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonPulse
        key={i}
        style={{
          height: 80,
          borderRadius: 16,
          backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
          marginBottom: 16,
        }}
      />
    ))}
  </View>
);

export const MetricDetailSkeleton: React.FC = () => (
  <View style={{ flex: 1, padding: 16 }}>
    <SkeletonPulse
      style={{
        height: 60,
        borderRadius: 16,
        backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
        marginBottom: 20,
      }}
    />
    <SkeletonPulse
      style={{
        height: 320,
        borderRadius: 16,
        backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.3),
        marginBottom: 24,
      }}
    />
    <SkeletonPulse
      style={{
        height: 60,
        borderRadius: 16,
        backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.2),
        marginBottom: 20,
      }}
    />
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonPulse
        key={i}
        style={{
          height: 60,
          borderRadius: 12,
          backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
          marginBottom: 12,
        }}
      />
    ))}
  </View>
);

export const EventListSkeleton: React.FC<{ count?: number }> = ({
  count = 3,
}) => (
  <View style={{ flex: 1, padding: 16 }}>
    <SkeletonPulse
      style={{
        height: 20,
        width: "50%",
        borderRadius: 8,
        backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.3),
        marginBottom: 16,
      }}
    />
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonPulse
        key={i}
        style={{
          height: 60,
          borderRadius: 12,
          backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
          marginBottom: 12,
        }}
      />
    ))}
  </View>
);

export const PostsSkeleton: React.FC<{ count?: number }> = ({
  count = 5,
}) => (
  <View style={{ flex: 1, padding: 16 }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonPulse
        key={i}
        style={{
          height: 180,
          marginBottom: 16,
          borderRadius: 12,
          backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
        }}
      />
    ))}
  </View>
);

export const PostDetailSkeleton: React.FC = () => (
  <View style={{ flex: 1, padding: 16 }}>
    {/* Post skeleton */}
    <SkeletonPulse
      style={{
        height: 250,
        marginBottom: 20,
        borderRadius: 12,
        backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
      }}
    />

    {/* Comments header */}
    <SkeletonPulse
      style={{
        height: 24,
        width: '40%',
        borderRadius: 4,
        backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.7),
        marginBottom: 16,
      }}
    />

    {/* Comments */}
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonPulse
        key={i}
        style={{
          height: 80,
          marginBottom: 8,
          borderRadius: 8,
          backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
        }}
      />
    ))}

    {/* Comment input */}
    <SkeletonPulse
      style={{
        height: 50,
        borderRadius: 25,
        backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  heroSkeleton: {
    height: HERO_SECTION_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  heroTextSkeleton: {
    width: "80%",
    height: 20,
    backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 8,
  },
  heroAccentSkeleton: {
    width: "60%",
    height: 16,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
  },
  sectionSkeleton: {
    marginBottom: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    marginRight: 12,
  },
  headerTextSkeleton: {
    flex: 1,
  },
  titleSkeleton: {
    width: "70%",
    height: 18,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.3),
    borderRadius: 9,
    marginBottom: 4,
  },
  subtitleSkeleton: {
    width: "50%",
    height: 12,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    borderRadius: 6,
  },
  buttonSkeleton: {
    width: 80,
    height: 32,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    borderRadius: 16,
  },
  carouselSkeleton: {
    paddingVertical: 16,
  },
  cardsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  cardSkeleton: {
    width: 280,
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  cardImageSkeleton: {
    width: "100%",
    height: 140,
    backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.1),
  },
  cardContent: {
    padding: 12,
  },
  cardTitleSkeleton: {
    width: "80%",
    height: 16,
    backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.1),
    borderRadius: 8,
    marginBottom: 8,
  },
  cardDescriptionSkeleton: {
    width: "60%",
    height: 12,
    backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.08),
    borderRadius: 6,
  },
  featuredSkeleton: {
    paddingHorizontal: 16,
    minHeight: FEATURED_SECTION_HEIGHT,
    marginBottom: 16,
  },
  featuredHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  featuredGrid: {
    flexDirection: "column",
    gap: 12,
  },
  featuredCardSkeleton: {
    borderRadius: AiraVariants.cardRadius,

    overflow: "hidden",
  },
  featuredCardImageSkeleton: {
    width: "100%",
    height: 120,
    backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.1),
  },
  ctaSkeleton: {
    marginHorizontal: 16,
    borderRadius: AiraVariants.cardRadius,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    padding: 24,
    height: 200,
    justifyContent: "center",
  },
  ctaContentSkeleton: {
    width: "100%",
    height: "100%",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
  },
  counselorSessionsContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  sessionHeaderSkeleton: {
    height: 40,
    backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 16,
  },
  sessionItemSkeleton: {
    height: 80,
    backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 8,
  },
  counselorChatContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  messageSkeleton: {
    height: 40,
  },

  messageContentSkeleton: {
    height: 40,
    backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
    borderRadius: AiraVariants.cardRadius,
    maxWidth: "80%",
  },
  inputSkeleton: {
    height: 50,
    backgroundColor: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
    borderRadius: AiraVariants.cardRadius,
    marginTop: "auto",
    marginBottom: 16,
  },
});
