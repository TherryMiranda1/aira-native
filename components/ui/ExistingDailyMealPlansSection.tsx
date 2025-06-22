import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { DailyMealPlan } from "@/services/api/dailyMealPlan.service";

interface ExistingDailyMealPlansSectionProps {
  plans: DailyMealPlan[];
  onPlanSelect?: (plan: DailyMealPlan) => void;
  onPlanDelete?: (planId: string) => void;
}

export const ExistingDailyMealPlansSection = ({
  plans,
  onPlanSelect,
  onPlanDelete,
}: ExistingDailyMealPlansSectionProps) => {
  const router = useRouter();

  const handlePlanPress = (plan: DailyMealPlan) => {
    if (onPlanSelect) {
      onPlanSelect(plan);
    } else {
      router.push({
        pathname: "/dashboard/plans/daily-meal-plan/[id]",
        params: { id: plan.id },
      });
    }
  };

  const handleDeletePress = (plan: DailyMealPlan) => {
    Alert.alert(
      "Eliminar Plan de Comidas",
      `¿Estás segura de que quieres eliminar "${plan.planTitle}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onPlanDelete?.(plan.id),
        },
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (plans.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <Ionicons
            name="restaurant"
            size={48}
            color={AiraColors.mutedForeground}
          />
          <ThemedText style={styles.emptyTitle}>
            No tienes planes de comidas guardados
          </ThemedText>
          <ThemedText style={styles.emptyDescription}>
            Genera tu primer plan de comidas y se guardará aquí automáticamente
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.sectionTitle}>
          Tus Planes de Comidas
        </ThemedText>
        <View style={styles.countBadge}>
          <ThemedText style={styles.countText}>{plans.length}</ThemedText>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.plansContainer}
      >
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => handlePlanPress(plan)}
          >
            <View style={styles.planHeader}>
              <LinearGradient
                colors={[AiraColors.accent, AiraColors.primary]}
                style={styles.planIcon}
              >
                <Ionicons name="restaurant" size={20} color="white" />
              </LinearGradient>

              <View style={styles.planHeaderActions}>
                {plan.isFavorite && (
                  <Ionicons name="heart" size={16} color={AiraColors.accent} />
                )}
                {onPlanDelete && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePress(plan)}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={AiraColors.mutedForeground}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.planContent}>
              <ThemedText style={styles.planTitle} numberOfLines={2}>
                {plan.planTitle}
              </ThemedText>

              <View style={styles.planMeta}>
                <View style={styles.planTypeContainer}>
                  <ThemedText style={styles.planType}>
                    Plan de Comidas
                  </ThemedText>
                </View>

                <ThemedText style={styles.planDate}>
                  {formatDate(plan.createdAt)}
                </ThemedText>
              </View>

              {plan.inputParameters.mainGoal && (
                <View style={styles.planObjective}>
                  <Ionicons name="flag" size={12} color={AiraColors.accent} />
                  <ThemedText style={styles.objectiveText} numberOfLines={1}>
                    {plan.inputParameters.mainGoal}
                  </ThemedText>
                </View>
              )}

              {plan.inputParameters.dietaryPreferences && (
                <View style={styles.planObjective}>
                  <Ionicons name="leaf" size={12} color={AiraColors.primary} />
                  <ThemedText style={styles.objectiveText} numberOfLines={1}>
                    {plan.inputParameters.dietaryPreferences}
                  </ThemedText>
                </View>
              )}

              <View style={styles.mealsInfo}>
                <Ionicons name="time" size={12} color={AiraColors.mutedForeground} />
                <ThemedText style={styles.mealsCount}>
                  {plan.meals.length} comidas planificadas
                </ThemedText>
              </View>
            </View>

            <View style={styles.planFooter}>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={AiraColors.mutedForeground}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  countBadge: {
    backgroundColor: AiraColors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  plansContainer: {
    gap: 12,
    paddingRight: 20,
  },
  planCard: {
    width: 280,
    height: 200,
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
    padding: 16,
    gap: 12,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  planHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  planContent: {
    flex: 1,
    gap: 8,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  planMeta: {
    gap: 6,
  },
  planTypeContainer: {
    alignSelf: "flex-start",
  },
  planType: {
    fontSize: 12,
    fontWeight: "500",
    color: AiraColors.accent,
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  planDate: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  planObjective: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  objectiveText: {
    fontSize: 12,
    color: AiraColors.foreground,
    flex: 1,
  },
  mealsInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mealsCount: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    fontWeight: "500",
  },
  planFooter: {
    alignItems: "flex-end",
  },
  emptyContainer: {
    marginTop: 20,
  },
  emptyCard: {
    backgroundColor: AiraColors.card,
    padding: 32,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 20,
  },
}); 