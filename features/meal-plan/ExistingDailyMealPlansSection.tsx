import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { ThemedText } from "../../components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { DailyMealPlan } from "@/services/api/dailyMealPlan.service";
import { ThemedView } from "@/components/ThemedView";
import { useAlert } from "@/components/ui/AlertSystem";

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
  const { showAlert } = useAlert();
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
    showAlert({
      type: "confirm",
      title: "Eliminar Plan",
      message: `¿Segura que quieres eliminar "${plan.planTitle}"?`,
      buttons: [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onPlanDelete?.(plan.id),
        },
      ],
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Hoy";
    if (diffDays === 2) return "Ayer";
    if (diffDays <= 7) return `Hace ${diffDays - 1} días`;

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  const getMainInfo = (plan: DailyMealPlan) => {
    if (plan.inputParameters.mainGoal) {
      return {
        icon: "flag" as const,
        text: plan.inputParameters.mainGoal,
        color: AiraColors.accent,
      };
    }
    if (plan.inputParameters.dietaryPreferences) {
      return {
        icon: "leaf" as const,
        text: plan.inputParameters.dietaryPreferences,
        color: AiraColors.primary,
      };
    }
    return null;
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
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No tienes planes guardados
          </ThemedText>
          <ThemedText type="small" style={styles.emptyDescription}>
            Genera tu primer plan de comidas y aparecerá aquí
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Planes de Comidas
        </ThemedText>
        <View style={styles.countBadge}>
          <ThemedText type="small" style={styles.countText}>
            {plans.length}
          </ThemedText>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.plansContainer}
      >
        {plans.map((plan) => {
          const mainInfo = getMainInfo(plan);

          return (
            <TouchableOpacity
              key={plan.id}
              onPress={() => handlePlanPress(plan)}
            >
              <ThemedView variant="border" style={styles.planCard}>
                <View style={styles.planHeader}>
                  <LinearGradient
                    colors={[AiraColors.accent, AiraColors.primary]}
                    style={styles.planIcon}
                  >
                    <Ionicons name="restaurant" size={18} color="white" />
                  </LinearGradient>

                  <View style={styles.planHeaderActions}>
                    {plan.isFavorite && (
                      <Ionicons
                        name="heart"
                        size={14}
                        color={AiraColors.accent}
                      />
                    )}
                    {onPlanDelete && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeletePress(plan)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={18}
                          color={AiraColors.mutedForeground}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.planContent}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.planTitle}
                    numberOfLines={2}
                  >
                    {plan.planTitle}
                  </ThemedText>

                  <View style={styles.planMeta}>
                    <ThemedText type="small" style={styles.planDate}>
                      {formatDate(plan.createdAt)}
                    </ThemedText>
                    <ThemedText type="small" style={styles.mealsCount}>
                      {plan.meals.length} comidas
                    </ThemedText>
                  </View>

                  {mainInfo && (
                    <View style={styles.planInfo}>
                      <Ionicons
                        name={mainInfo.icon}
                        size={12}
                        color={mainInfo.color}
                      />
                      <ThemedText
                        type="small"
                        style={styles.infoText}
                        numberOfLines={1}
                      >
                        {mainInfo.text}
                      </ThemedText>
                    </View>
                  )}
                </View>

                <View style={styles.planFooter}>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={AiraColors.mutedForeground}
                  />
                </View>
              </ThemedView>
            </TouchableOpacity>
          );
        })}
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
  sectionTitle: {},
  countBadge: {
    backgroundColor: AiraColors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  countText: {
    color: "white",
  },
  plansContainer: {
    gap: 12,
    paddingRight: 20,
  },
  planCard: {
    width: 260,
    height: 180,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    gap: 12,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planIcon: {
    width: 32,
    height: 32,
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
    lineHeight: 20,
  },
  planMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planDate: {
    color: AiraColors.mutedForeground,
  },
  mealsCount: {
    color: AiraColors.mutedForeground,
  },
  planInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    flex: 1,
  },
  planFooter: {
    alignItems: "flex-end",
  },
  emptyContainer: {
    marginTop: 20,
  },
  emptyCard: {
    padding: 32,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptyDescription: {
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 18,
  },
});
