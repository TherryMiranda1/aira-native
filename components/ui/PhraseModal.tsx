import React from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ColorValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Phrase } from "@/services/api/phrase.service";

const { width, height } = Dimensions.get("window");

interface PhraseModalProps {
  visible: boolean;
  phrase: Phrase | null;
  categoryColors: string[];
  categoryLabel: string;
  currentIndex: number;
  totalCount: number;
  copiedId: string | null;
  isLiked: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRandom: () => void;
  onCopy: (phrase: string, id: string) => void;
  onLike: (id: string) => void;
  onShare: (phrase: string) => void;
}

export const PhraseModal = ({
  visible,
  phrase,
  categoryColors,
  categoryLabel,
  currentIndex,
  totalCount,
  copiedId,
  isLiked,
  onClose,
  onNext,
  onPrevious,
  onRandom,
  onCopy,
  onLike,
  onShare,
}: PhraseModalProps) => {
  if (!phrase) return null;

  const getMomentIcon = (moment?: string) => {
    switch (moment) {
      case "manana":
        return "sunny";
      case "dia":
        return "sunny";
      case "tarde":
        return "partly-sunny";
      case "noche":
        return "moon";
      default:
        return "star";
    }
  };

  const getMomentLabel = (moment?: string) => {
    switch (moment) {
      case "manana":
        return "Mañana";
      case "dia":
        return "Día";
      case "tarde":
        return "Tarde";
      case "noche":
        return "Noche";
      default:
        return "Cualquier momento";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={AiraColors.foreground} />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>
              Frase Inspiradora
            </ThemedText>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Navigation Controls */}
            <View style={styles.navigationContainer}>
              <View style={styles.navigationLeft}>
                <ThemedText style={styles.navigationText}>
                  {currentIndex + 1} de {totalCount}
                </ThemedText>
                <View style={styles.navigationButtons}>
                  <TouchableOpacity
                    style={[
                      styles.navigationButton,
                      totalCount <= 1 && styles.navigationButtonDisabled,
                    ]}
                    onPress={onPrevious}
                    disabled={totalCount <= 1}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={20}
                      color={AiraColors.mutedForeground}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.navigationButton,
                      totalCount <= 1 && styles.navigationButtonDisabled,
                    ]}
                    onPress={onNext}
                    disabled={totalCount <= 1}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={AiraColors.mutedForeground}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.randomButton} onPress={onRandom}>
                <Ionicons name="shuffle" size={16} color={AiraColors.primary} />
                <ThemedText style={styles.randomButtonText}>
                  Sorpréndeme
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Phrase Card */}
            <View style={styles.phraseCard}>
              <LinearGradient
                colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.05)"]}
                style={styles.phraseCardGradient}
              />

              {/* Quote Icon */}
              <LinearGradient
                colors={categoryColors as [ColorValue, ColorValue]}
                style={styles.quoteIcon}
              >
                <Ionicons name="sparkles" size={32} color="white" />
              </LinearGradient>

              {/* Phrase Text */}
              <ThemedText style={styles.phraseText}>
                &quot;{phrase.frase}&quot;
              </ThemedText>

              {/* Metadata */}
              <View style={styles.metadataContainer}>
                <LinearGradient
                  colors={categoryColors as [ColorValue, ColorValue]}
                  style={styles.categoryBadge}
                >
                  <ThemedText style={styles.categoryBadgeText}>
                    {categoryLabel}
                  </ThemedText>
                </LinearGradient>

                {phrase.momento_recomendado && (
                  <View style={styles.momentBadge}>
                    <Ionicons
                      name={getMomentIcon(phrase.momento_recomendado)}
                      size={14}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText style={styles.momentBadgeText}>
                      {getMomentLabel(phrase.momento_recomendado)}
                    </ThemedText>
                  </View>
                )}

                {phrase.popularidad > 0 && (
                  <View style={styles.popularityBadge}>
                    <Ionicons
                      name="heart"
                      size={14}
                      color={AiraColors.accent}
                    />
                    <ThemedText style={styles.popularityBadgeText}>
                      {phrase.popularidad}
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Actions */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onCopy(phrase.frase, phrase.id)}
                >
                  <Ionicons
                    name={copiedId === phrase.id ? "checkmark" : "copy"}
                    size={18}
                    color={AiraColors.primary}
                  />
                  <ThemedText style={styles.actionButtonText}>
                    {copiedId === phrase.id ? "Copiado" : "Copiar"}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    isLiked && styles.actionButtonLiked,
                  ]}
                  onPress={() => onLike(phrase.id)}
                >
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={18}
                    color={isLiked ? AiraColors.accent : AiraColors.primary}
                  />
                  <ThemedText
                    style={[
                      styles.actionButtonText,
                      isLiked && styles.actionButtonTextLiked,
                    ]}
                  >
                    Me gusta
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onShare(phrase.frase)}
                >
                  <Ionicons name="share" size={18} color={AiraColors.primary} />
                  <ThemedText style={styles.actionButtonText}>
                    Compartir
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Inspirational Footer */}
            <View style={styles.footer}>
              <LinearGradient
                colors={categoryColors as [ColorValue, ColorValue]}
                style={styles.footerIcon}
              >
                <Ionicons name="heart" size={20} color="white" />
              </LinearGradient>
              <ThemedText style={styles.footerTitle}>
                Momento de Reflexión
              </ThemedText>
              <ThemedText style={styles.footerDescription}>
                Permite que estas palabras resuenen en tu corazón y te acompañen
                en tu camino de crecimiento personal.
              </ThemedText>
            </View>
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  navigationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  navigationText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  navigationButtons: {
    flexDirection: "row",
    gap: 4,
  },
  navigationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  navigationButtonDisabled: {
    opacity: 0.3,
  },
  randomButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    gap: 6,
  },
  randomButtonText: {
    fontSize: 14,
    color: AiraColors.primary,
    fontWeight: "500",
  },
  phraseCard: {
    backgroundColor: AiraColors.card,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: AiraVariants.cardRadius,
    padding: 32,
    alignItems: "center",

    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
    position: "relative",
    overflow: "hidden",
  },
  phraseCardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  quoteIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  phraseText: {
    fontSize: 20,
    fontWeight: "500",
    color: AiraColors.foreground,
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  metadataContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryBadgeText: {
    fontSize: 13,
    color: "white",
    fontWeight: "600",
  },
  momentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  momentBadgeText: {
    fontSize: 13,
    color: AiraColors.mutedForeground,
  },
  popularityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  popularityBadgeText: {
    fontSize: 13,
    color: AiraColors.accent,
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    minWidth: 100,
    justifyContent: "center",
  },
  actionButtonLiked: {
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
  },
  actionButtonText: {
    fontSize: 15,
    color: AiraColors.primary,
    fontWeight: "500",
  },
  actionButtonTextLiked: {
    color: AiraColors.accent,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  footerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 12,
  },
  footerDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
  },
});
