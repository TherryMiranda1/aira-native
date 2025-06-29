import React from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { Phrase } from "@/services/api/phrase.service";

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
        return "sunny-outline";
      case "dia":
        return "sunny-outline";
      case "tarde":
        return "partly-sunny-outline";
      case "noche":
        return "moon-outline";
      default:
        return "star-outline";
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

  const getDifficultyColor = () => {
    return categoryColors[0] || AiraColors.primary;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={AiraColors.foreground} />
          </TouchableOpacity>
          <View style={styles.navigationInfo}>
            <ThemedText style={styles.navigationText}>
              {currentIndex + 1} de {totalCount}
            </ThemedText>
            <TouchableOpacity style={styles.shuffleButton} onPress={onRandom}>
              <Ionicons name="shuffle" size={16} color={AiraColors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Quote Section */}
          <View style={styles.quoteSection}>
            <View
              style={[
                styles.quoteIcon,
                { backgroundColor: getDifficultyColor() + "20" },
              ]}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={32}
                color={getDifficultyColor()}
              />
            </View>

            <ThemedText type="title" style={styles.quoteText}>
              {phrase.frase}
            </ThemedText>
          </View>

          {/* Metadata */}
          <View style={styles.metadataSection}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getDifficultyColor() },
              ]}
            >
              <ThemedText style={styles.categoryText}>
                {categoryLabel}
              </ThemedText>
            </View>

            {phrase.momento_recomendado && (
              <View style={styles.momentBadge}>
                <Ionicons
                  name={getMomentIcon(phrase.momento_recomendado)}
                  size={14}
                  color={AiraColors.mutedForeground}
                />
                <ThemedText style={styles.momentText}>
                  {getMomentLabel(phrase.momento_recomendado)}
                </ThemedText>
              </View>
            )}

            {phrase.popularidad > 0 && (
              <View style={styles.popularityBadge}>
                <Ionicons name="heart" size={14} color="#FF6B6B" />
                <ThemedText style={styles.popularityText}>
                  {phrase.popularidad}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onCopy(phrase.frase, phrase.id)}
            >
              <Ionicons
                name={copiedId === phrase.id ? "checkmark" : "copy-outline"}
                size={18}
                color={AiraColors.primary}
              />
              <ThemedText style={styles.actionText} numberOfLines={1}>
                {copiedId === phrase.id ? "Copiado" : "Copiar"}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                isLiked && styles.actionButtonActive,
              ]}
              onPress={() => onLike(phrase.id)}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={18}
                color={isLiked ? "#FF6B6B" : AiraColors.primary}
              />
              <ThemedText
                style={[styles.actionText, isLiked && styles.actionTextActive]}
                numberOfLines={1}
              >
                Me gusta
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onShare(phrase.frase)}
            >
              <Ionicons
                name="share-outline"
                size={18}
                color={AiraColors.primary}
              />
              <ThemedText style={styles.actionText} numberOfLines={1}>
                Compartir
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Navigation */}
          {totalCount > 1 && (
            <View style={styles.navigationSection}>
              <TouchableOpacity style={styles.navButton} onPress={onPrevious}>
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={AiraColors.primary}
                />
                <ThemedText style={styles.navButtonText}>Anterior</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navButton} onPress={onNext}>
                <ThemedText style={styles.navButtonText}>Siguiente</ThemedText>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={AiraColors.primary}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AiraColors.border + "20",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AiraColors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  navigationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  navigationText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  shuffleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AiraColors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  quoteSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  quoteIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  quoteText: {
    color: AiraColors.foreground,
    textAlign: "center",
    lineHeight: 32,
    paddingHorizontal: 8,
  },
  metadataSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 40,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    color: "#fff",
  },
  momentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColors.card,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 6,
  },
  momentText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  popularityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B" + "20",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  popularityText: {
    fontSize: 14,
    color: "#FF6B6B",
  },
  actionsSection: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColors.card,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 6,
    minWidth: 90,
    maxWidth: 110,
    justifyContent: "center",
    flex: 1,
  },
  actionButtonActive: {
    backgroundColor: "#FF6B6B" + "20",
  },
  actionText: {
    fontSize: 13,
    color: AiraColors.primary,
    textAlign: "center",
  },
  actionTextActive: {
    color: "#FF6B6B",
  },
  navigationSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 16,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColors.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    gap: 8,
    flex: 1,
    justifyContent: "center",
    maxWidth: 140,
  },
  navButtonText: {
    fontSize: 16,
    color: AiraColors.primary,
  },
  bottomSpacing: {
    height: 40,
  },
});
