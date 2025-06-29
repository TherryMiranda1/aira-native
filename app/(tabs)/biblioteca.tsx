import React, { useMemo } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { LibraryCategory } from "@/types/biblioteca";
import { bibliotecaData } from "@/data/bibliotecaData";

export default function BibliotecaScreen() {
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

  return (
    <PageView>
      <Topbar title="Tu Biblioteca ✨" actions={<ProfileButton />} />
      <LinearGradient
        colors={[AiraColors.airaLavenderSoft, AiraColors.background]}
        style={styles.heroSection}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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

          <View style={styles.sectionsContainer}>
            {bibliotecaData.map((section, index) => (
              <HorizontalCarousel key={section.id} section={section} />
            ))}
          </View>

          {featuredItems.length > 0 && (
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
                  <CategoryCard
                    key={`featured-${index}`}
                    category={item.category}
                    sectionGradient={item.sectionGradient}
                    featured={true}
                  />
                ))}
              </View>
            </View>
          )}

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
                <TouchableOpacity style={styles.ctaPrimaryButton}>
                  <Ionicons
                    name="sparkles"
                    size={18}
                    color={AiraColors.primary}
                  />
                  <ThemedText style={styles.ctaPrimaryText}>
                    Crear Mi Plan Personal
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctaSecondaryButton}>
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

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              Tu biblioteca se actualiza constantemente con nuevo contenido
              personalizado.
            </ThemedText>
            <ThemedText style={styles.footerCredit}>
              Creada con 💜 por el equipo de Aira para tu bienestar integral
            </ThemedText>
          </View>
        </ScrollView>
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
    flex: 1,
  },
  heroContent: {
    alignItems: "center",
  },
  heroHeader: {
    alignItems: "center",
    marginBottom: 24,
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
  statLabel: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  featuredSection: {
    paddingHorizontal: 8,
    marginVertical: 16,
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
  sectionsContainer: {
    marginBottom: 32,
  },
  ctaSection: {
    marginHorizontal: 16,
    borderRadius: AiraVariants.cardRadius,
    padding: 24,
    marginBottom: 24,
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
    fontStyle: "italic",
  },
});
