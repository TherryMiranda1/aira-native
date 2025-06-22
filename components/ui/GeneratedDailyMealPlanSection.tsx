import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

import { DailyMealPlanInput, DailyMealPlanOutput } from "@/types/Assistant";

interface GeneratedDailyMealPlanSectionProps {
  plan: DailyMealPlanOutput;
  inputParams: DailyMealPlanInput;
  onSave: () => Promise<void>;
  onRegenerate: () => void;
  onEditParams: () => void;
  isSaving: boolean;
  isRegenerating: boolean;
}

export function GeneratedDailyMealPlanSection({
  plan,
  inputParams,
  onSave,
  onRegenerate,
  onEditParams,
  isSaving,
  isRegenerating,
}: GeneratedDailyMealPlanSectionProps) {
  const handleSave = async () => {
    try {
      await onSave();
    } catch (error) {
      console.error("Error al guardar plan:", error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.headerCard}>
          <LinearGradient
            colors={[AiraColors.primary, AiraColors.accent]}
            style={styles.headerGradient}
          >
            <Ionicons name="restaurant" size={32} color="white" />
            <ThemedText style={styles.planTitle}>{plan.planTitle}</ThemedText>
            {plan.introduction && (
              <ThemedText style={styles.introduction}>
                {plan.introduction}
              </ThemedText>
            )}
          </LinearGradient>
        </View>

        <View style={styles.mealsSection}>
          <ThemedText style={styles.sectionTitle}>
            Tu Plan de Comidas
          </ThemedText>
          {plan.meals.map((meal, index) => (
            <View key={index} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <ThemedText style={styles.mealType}>{meal.mealType}</ThemedText>
              </View>
              <View style={styles.mealOptions}>
                {meal.options.map((option, optionIndex) => (
                  <View key={optionIndex} style={styles.optionItem}>
                    <View style={styles.optionBullet} />
                    <ThemedText style={styles.optionText}>{option}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {plan.generalTips && (
          <View style={styles.tipsSection}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb" size={20} color={AiraColors.primary} />
              <ThemedText style={styles.tipsTitle}>
                Consejos Generales
              </ThemedText>
            </View>
            <ThemedText style={styles.tipsText}>{plan.generalTips}</ThemedText>
          </View>
        )}

        {plan.suggestedNextActions && plan.suggestedNextActions.length > 0 && (
          <View style={styles.actionsSection}>
            <ThemedText style={styles.sectionTitle}>
              ¿Qué te gustaría hacer ahora?
            </ThemedText>
            <View style={styles.actionsGrid}>
              {plan.suggestedNextActions.map((action, index) => (
                <TouchableOpacity key={index} style={styles.actionButton}>
                  <ThemedText style={styles.actionText}>
                    {action.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.controlsSection}>
          <TouchableOpacity
            style={[styles.controlButton, styles.editButton]}
            onPress={onEditParams}
          >
            <Ionicons name="create" size={20} color={AiraColors.primary} />
            <ThemedText style={styles.editButtonText}>
              Editar Parámetros
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.regenerateButton]}
            onPress={onRegenerate}
            disabled={isRegenerating}
          >
            {isRegenerating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="refresh" size={20} color="white" />
            )}
            <ThemedText style={styles.regenerateButtonText}>
              {isRegenerating ? "Regenerando..." : "Regenerar Plan"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.saveButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <LinearGradient
              colors={[AiraColors.primary, AiraColors.accent]}
              style={styles.saveGradient}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="bookmark" size={20} color="white" />
              )}
              <ThemedText style={styles.saveButtonText}>
                {isSaving ? "Guardando..." : "Guardar Plan"}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
    marginBottom: 24,
  },
  headerGradient: {
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  introduction: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 22,
  },
  mealsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AiraColors.border,
  },
  mealHeader: {
    marginBottom: 12,
  },
  mealType: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.primary,
  },
  mealOptions: {
    gap: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  optionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AiraColors.accent,
    marginTop: 6,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  tipsSection: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.primary,
  },
  tipsText: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.2),
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    color: AiraColors.primary,
    fontWeight: "500",
  },
  controlsSection: {
    gap: 12,
  },
  controlButton: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  editButton: {
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: AiraColors.primary,
  },
  regenerateButton: {
    backgroundColor: AiraColors.mutedForeground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  regenerateButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  saveButton: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  saveGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
