import React, { useMemo, useEffect } from "react";
import { 
  View, 
  FlatList,
  StyleSheet, 
  TouchableOpacity,
  ListRenderItem 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { OptimizedHorizontalCarousel } from "@/components/ui/OptimizedHorizontalCarousel";
import { OptimizedCategoryCard } from "@/components/ui/OptimizedCategoryCard";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { LibraryCategory, LibrarySection } from "@/types/biblioteca";
import { bibliotecaData } from "@/data/bibliotecaData";
import { useImageOptimization } from "@/hooks/useImageOptimization";

const SECTION_HEIGHT = 300;
const FEATURED_SECTION_HEIGHT = 400;
const CTA_SECTION_HEIGHT = 300;
const HERO_SECTION_HEIGHT = 150;

interface FeedItem {
  id: string;
  type: 'hero' | 'section' | 'featured' | 'cta' | 'footer';
  data?: LibrarySection | LibraryCategory[];
}

export default function BibliotecaScreen() {
  const { prefetchImages } = useImageOptimization();
  
  const featuredItems = useMemo(() => {
    const items: Array<{
      category: LibraryCategory;
      sectionGradient: string;
    }> = [];

    bibliotecaData.forEach((section) => {
      section.categories.forEach((category) => {
        if (category.featured) {
          items.push({
            category,
            sectionGradient: section.gradient,
          });
        }
      });
    });

    return items;
  }, []);

  const feedData = useMemo<FeedItem[]>(() => {
    const items: FeedItem[] = [
      { id: 'hero', type: 'hero' },
      ...bibliotecaData.map((section) => ({
        id: section.id,
        type: 'section' as const,
        data: section,
      })),
    ];

    if (featuredItems.length > 0) {
      items.push({
        id: 'featured',
        type: 'featured',
        data: featuredItems.map(item => item.category),
      });
    }

    items.push(
      { id: 'cta', type: 'cta' },
      { id: 'footer', type: 'footer' }
    );

    return items;
  }, [featuredItems]);

  const allImageUris = useMemo(() => {
    const uris: string[] = [];
    bibliotecaData.forEach(section => {
      section.categories.forEach(category => {
        if (category.image) {
          uris.push(category.image);
        }
      });
    });
    return uris;
  }, []);

  useEffect(() => {
    prefetchImages(allImageUris.slice(0, 6));
  }, [prefetchImages, allImageUris]);

  const getEstimatedItemSize = (item: FeedItem) => {
    switch (item.type) {
      case 'hero':
        return HERO_SECTION_HEIGHT;
      case 'section':
        return SECTION_HEIGHT;
      case 'featured':
        return FEATURED_SECTION_HEIGHT;
      case 'cta':
        return CTA_SECTION_HEIGHT;
      case 'footer':
        return 100;
      default:
        return SECTION_HEIGHT;
    }
  };

  const keyExtractor = (item: FeedItem) => item.id;

  const renderHeroSection = () => (
    <View style={styles.heroSection}>
      <View style={styles.heroHeader}>
        <View style={styles.heroText}>
          <ThemedText style={styles.heroDescription}>
            Explora tu colección personal de herramientas para el bienestar.
          </ThemedText>
          <ThemedText style={styles.heroAccent}>
            ¡Descubre, aprende y crece! 🌟
          </ThemedText>
        </View>
      </View>
    </View>
  );

  const renderFeaturedSection = (categories: LibraryCategory[]) => (
    <View style={styles.featuredSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <LinearGradient
            colors={[AiraColors.primary, AiraColors.accent]}
            style={styles.sectionIcon}
          >
            <Ionicons
              name="star"
              size={20}
              color={AiraColors.background}
            />
          </LinearGradient>
          <View>
            <ThemedText
              type="defaultSemiBold"
              style={styles.sectionTitle}
            >
              Destacados
            </ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Contenido seleccionado especialmente para ti
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.featuredGrid}>
        {featuredItems.map((item, index) => (
          <OptimizedCategoryCard
            key={`featured-${index}`}
            category={item.category}
            sectionGradient={item.sectionGradient}
            featured={true}
          />
        ))}
      </View>
    </View>
  );

  const renderCTASection = () => (
    <LinearGradient
      colors={[AiraColors.primary, AiraColors.accent]}
      style={styles.ctaSection}
    >
      <View style={styles.ctaContent}>
        <View style={styles.ctaIconContainer}>
          <Ionicons
            name="rocket"
            size={28}
            color={AiraColors.background}
          />
        </View>
        <ThemedText type="defaultSemiBold" style={styles.ctaTitle}>
          ¿Lista para comenzar tu transformación? 🚀
        </ThemedText>
        <ThemedText style={styles.ctaDescription}>
          Tu biblioteca está llena de herramientas poderosas. Comienza
          explorando las secciones que más te llaman la atención y
          descubre cómo cada una puede apoyarte en tu viaje hacia el
          bienestar integral.
        </ThemedText>

        <View style={styles.ctaButtons}>
          <TouchableOpacity
            onPress={() => router.push("/dashboard/plans/complete-plan")}
            style={styles.ctaPrimaryButton}
          >
            <Ionicons
              name="sparkles"
              size={18}
              color={AiraColors.primary}
            />
            <ThemedText style={styles.ctaPrimaryText}>
              Crear Mi Plan Personal
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/dashboard/inspiration/frases")}
            style={styles.ctaSecondaryButton}
          >
            <Ionicons
              name="heart"
              size={18}
              color={AiraColors.background}
            />
            <ThemedText style={styles.ctaSecondaryText}>
              Explorar Inspiración
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  const renderFooterSection = () => (
    <View style={styles.footer}>
      <ThemedText style={styles.footerText}>
        Tu biblioteca se actualiza constantemente con nuevo contenido
        personalizado.
      </ThemedText>
      <ThemedText type="defaultItalic" style={styles.footerCredit}>
        Creada con 💜 por el equipo de Aira para tu bienestar integral
      </ThemedText>
    </View>
  );

  const renderFeedItem: ListRenderItem<FeedItem> = ({ item }) => {
    switch (item.type) {
      case 'hero':
        return renderHeroSection();
      case 'section':
        return <OptimizedHorizontalCarousel section={item.data as LibrarySection} />;
      case 'featured':
        return renderFeaturedSection(item.data as LibraryCategory[]);
      case 'cta':
        return renderCTASection();
      case 'footer':
        return renderFooterSection();
      default:
        return null;
    }
  };

  return (
    <PageView>
      <Topbar title="Tu Biblioteca ✨" actions={<ProfileButton />} />
      <LinearGradient
        colors={[AiraColors.airaLavenderSoft, AiraColors.background]}
        style={styles.container}
      >
        <FlatList
          data={feedData}
          renderItem={renderFeedItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          windowSize={5}
          initialNumToRender={4}
          maxToRenderPerBatch={3}
          updateCellsBatchingPeriod={50}
          bounces={true}
          contentContainerStyle={styles.scrollContent}
        />
      </LinearGradient>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
  },
  heroSection: {
    height: HERO_SECTION_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  heroHeader: {
    alignItems: "center",
  },
  heroText: {
    alignItems: "center",
  },
  heroDescription: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  heroAccent: {
    fontSize: 14,
    color: AiraColors.primary,
    textAlign: "center",
  },
  featuredSection: {
    paddingHorizontal: 8,
    minHeight: FEATURED_SECTION_HEIGHT,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    color: AiraColors.foreground,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  featuredGrid: {
    flexDirection: "column",
    gap: 8,
  },
  ctaSection: {
    marginHorizontal: 16,
    borderRadius: AiraVariants.cardRadius,
    padding: 24,
    minHeight: CTA_SECTION_HEIGHT,
  },
  ctaContent: {
    alignItems: "center",
  },
  ctaIconContainer: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  ctaTitle: {
    fontSize: 20,
    color: AiraColors.background,
    textAlign: "center",
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 14,
    color: AiraColorsWithAlpha.backgroundWithOpacity(0.9),
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  ctaButtons: {
    flexDirection: "column",
    gap: 12,
    width: "100%",
  },
  ctaPrimaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AiraColors.background,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: AiraVariants.cardRadius,
  },
  ctaPrimaryText: {
    fontSize: 16,
    color: AiraColors.primary,
    marginLeft: 8,
  },
  ctaSecondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: AiraColorsWithAlpha.backgroundWithOpacity(0.3),
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: AiraVariants.cardRadius,
  },
  ctaSecondaryText: {
    fontSize: 16,
    color: AiraColors.background,
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 16,
    alignItems: "center",
    height: 100,
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 8,
  },
  footerCredit: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    textAlign: "center",
  },
});
