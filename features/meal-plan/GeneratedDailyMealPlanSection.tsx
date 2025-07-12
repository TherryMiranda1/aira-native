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
import { ThemedView } from "@/components/ThemedView";

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
            <Ionicons name="restaurant" size={28} color="white" />
            <ThemedText type="title" style={styles.planTitle}>
              {plan.planTitle}
            </ThemedText>
            {plan.introduction && (
              <ThemedText type="default" style={styles.introduction}>
                {plan.introduction}
              </ThemedText>
            )}
          </LinearGradient>
        </View>

        <View style={styles.mealsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Tu Plan de Comidas
          </ThemedText>
          {plan.meals.map((meal, index) => (
            <ThemedView variant="border" key={index} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <ThemedText type="defaultSemiBold" style={styles.mealType}>
                  {meal.mealType}
                </ThemedText>
              </View>
              <View style={styles.mealOptions}>
                {meal.options.map((option, optionIndex) => (
                  <View key={optionIndex} style={styles.optionItem}>
                    <View style={styles.optionBullet} />
                    <ThemedText type="small" style={styles.optionText}>
                      {option}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </ThemedView>
          ))}
        </View>

        {plan.generalTips && (
          <View style={styles.tipsSection}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb" size={18} color={AiraColors.primary} />
              <ThemedText type="defaultSemiBold" style={styles.tipsTitle}>
                Consejos Generales
              </ThemedText>
            </View>
            <ThemedText type="small" style={styles.tipsText}>
              {plan.generalTips}
            </ThemedText>
          </View>
        )}

        {plan.suggestedNextActions && plan.suggestedNextActions.length > 0 && (
          <View style={styles.actionsSection}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              ¿Qué te gustaría hacer ahora?
            </ThemedText>
            <View style={styles.actionsGrid}>
              {plan.suggestedNextActions.slice(0, 3).map((action, index) => (
                <TouchableOpacity key={index} style={styles.actionButton}>
                  <ThemedText type="small" style={styles.actionText}>
                    {action.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.controlsSection}>
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.editButton} onPress={onEditParams}>
              <Ionicons name="create" size={18} color={AiraColors.primary} />
              <ThemedText type="small" style={styles.editButtonText}>
                Editar
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={onRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="refresh" size={18} color="white" />
              )}
              <ThemedText type="small" style={styles.regenerateButtonText}>
                {isRegenerating ? "Regenerando..." : "Regenerar"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
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
              <ThemedText type="defaultSemiBold" style={styles.saveButtonText}>
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
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
    marginBottom: 24,
  },
  headerGradient: {
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  planTitle: {
    textAlign: "center",
  },
  introduction: {
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
  },
  mealsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  mealCard: {
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 12,
  },
  mealHeader: {
    marginBottom: 12,
  },
  mealType: {
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
     
    lineHeight: 18,
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
    color: AiraColors.primary,
  },
  tipsText: {
    lineHeight: 18,
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
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    color: AiraColors.primary,
  },
  controlsSection: {
    gap: 12,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    borderRadius: AiraVariants.cardRadius,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  editButtonText: {
    color: AiraColors.primary,
  },
  regenerateButton: {
    flex: 1,
    backgroundColor: AiraColors.mutedForeground,
    borderRadius: AiraVariants.cardRadius,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  regenerateButtonText: {
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
    color: "white",
  },
});
