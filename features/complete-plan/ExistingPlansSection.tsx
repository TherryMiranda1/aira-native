import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { GeneratedPlan } from "@/services/api/generatedPlan.service";
import { useAlertHelpers } from "@/components/ui/AlertSystem";
import { ThemedView } from "@/components/ThemedView";

interface ExistingPlansSectionProps {
  plans: GeneratedPlan[];
  onPlanSelect?: (plan: GeneratedPlan) => void;
  onPlanDelete?: (planId: string) => void;
}

export const ExistingPlansSection = ({
  plans,
  onPlanSelect,
  onPlanDelete,
}: ExistingPlansSectionProps) => {
  const { showConfirm } = useAlertHelpers();
  const router = useRouter();

  const handlePlanPress = (plan: GeneratedPlan) => {
    if (onPlanSelect) {
      onPlanSelect(plan);
    } else {
      router.push({
        pathname: "/dashboard/plans/complete-plan/[id]",
        params: { id: plan.id },
      });
    }
  };

  const handleDeletePress = (plan: GeneratedPlan) => {
    showConfirm(
      "Eliminar Plan",
      `¿Segura que quieres eliminar "${plan.title}"?`,
      () => onPlanDelete?.(plan.id)
    );
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

  const getPlanTypeIcon = (type: string) => {
    switch (type) {
      case "comprehensive":
        return "person";
      case "nutrition":
        return "restaurant";
      case "workout":
        return "fitness";
      case "wellness":
        return "heart";
      default:
        return "document";
    }
  };

  const getPlanTypeLabel = (type: string) => {
    switch (type) {
      case "comprehensive":
        return "Integral";
      case "nutrition":
        return "Nutricional";
      case "workout":
        return "Entrenamiento";
      case "wellness":
        return "Bienestar";
      default:
        return "Plan";
    }
  };

  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case "comprehensive":
        return [AiraColors.primary, AiraColors.accent];
      case "nutrition":
        return [AiraColors.accent, "#10B981"];
      case "workout":
        return ["#EF4444", "#F97316"];
      case "wellness":
        return ["#8B5CF6", "#A855F7"];
      default:
        return [AiraColors.primary, AiraColors.accent];
    }
  };

  if (plans.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <Ionicons
            name="folder-open"
            size={48}
            color={AiraColors.mutedForeground}
          />
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No tienes planes guardados
          </ThemedText>
          <ThemedText type="small" style={styles.emptyDescription}>
            Genera tu primer plan personalizado y aparecerá aquí
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Planes Guardados
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
        {plans.map((plan) => (
          <TouchableOpacity key={plan.id} onPress={() => handlePlanPress(plan)}>
            <ThemedView variant="border" style={styles.planCard}>
              <View style={styles.planHeader}>
                <LinearGradient
                  colors={getPlanTypeColor(plan.planType) as [string, string]}
                  style={styles.planIcon}
                >
                  <Ionicons
                    name={getPlanTypeIcon(plan.planType)}
                    size={18}
                    color="white"
                  />
                </LinearGradient>

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

              <View style={styles.planContent}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.planTitle}
                  numberOfLines={2}
                >
                  {plan.title}
                </ThemedText>

                <View style={styles.planMeta}>
                  <View style={styles.planTypeContainer}>
                    <ThemedText type="small" style={styles.planType}>
                      {getPlanTypeLabel(plan.planType)}
                    </ThemedText>
                  </View>
                  <ThemedText type="small" style={styles.planDate}>
                    {formatDate(plan.createdAt)}
                  </ThemedText>
                </View>

                {plan.inputParameters?.objetivo && (
                  <View style={styles.planObjective}>
                    <Ionicons
                      name="flag"
                      size={12}
                      color={AiraColors.primary}
                    />
                    <ThemedText
                      type="small"
                      style={styles.objectiveText}
                      numberOfLines={1}
                    >
                      {plan.inputParameters.objetivo}
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
  sectionTitle: {},
  countBadge: {
    backgroundColor: AiraColors.primary,
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
  planTypeContainer: {
    alignSelf: "flex-start",
  },
  planType: {
    color: AiraColors.primary,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  planDate: {
    color: AiraColors.mutedForeground,
  },
  planObjective: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  objectiveText: {
     
    flex: 1,
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
     
    textAlign: "center",
  },
  emptyDescription: {
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 18,
  },
});
