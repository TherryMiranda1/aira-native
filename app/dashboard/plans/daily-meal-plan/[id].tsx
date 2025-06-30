import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Topbar } from "@/components/ui/Topbar";
import { useDailyMealPlans } from "@/hooks/services/useDailyMealPlans";
import { DailyMealPlan } from "@/services/api/dailyMealPlan.service";
import { PageView } from "@/components/ui/PageView";
import { useAlertHelpers } from "@/components/ui/AlertSystem";
import { useToastHelpers } from "@/components/ui/ToastSystem";

type ViewState = "loading" | "loaded" | "error" | "not-found";

export default function DailyMealPlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    plans,
    deletePlan,
    toggleFavorite,
    loading: plansLoading,
  } = useDailyMealPlans();
  const { showConfirm } = useAlertHelpers();
  const { showSuccessToast, showErrorToast } = useToastHelpers();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [plan, setPlan] = useState<DailyMealPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!plansLoading) {
      loadPlan();
    }
  }, [id, plansLoading, plans]);

  const loadPlan = async () => {
    if (!id) {
      setViewState("not-found");
      setError("ID de plan no válido");
      return;
    }

    try {
      setViewState("loading");
      setError(null);

      const planData = plans.find((p) => p.id === id);

      if (!planData) {
        setViewState("not-found");
        setError("Plan de comidas no encontrado");
        return;
      }

      setPlan(planData);
      setViewState("loaded");
    } catch (err) {
      console.error("Error loading daily meal plan:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar el plan de comidas"
      );
      setViewState("error");
    }
  };

  const handleDeletePlan = async () => {
    if (!plan) return;

    showConfirm(
      "Eliminar Plan de Comidas",
      `¿Estás segura de que quieres eliminar "${plan.planTitle}"? Esta acción no se puede deshacer.`,
      confirmDeletePlan,
      undefined,
      "Eliminar",
      "Cancelar"
    );
  };

  const confirmDeletePlan = async () => {
    if (!plan) return;

    try {
      setIsDeleting(true);
      await deletePlan(plan.id);

      showSuccessToast(
        "Plan eliminado",
        "El plan de comidas se ha eliminado correctamente"
      );
      router.back();
    } catch (error) {
      console.error("Error deleting daily meal plan:", error);
      showErrorToast(
        "Error",
        "No se pudo eliminar el plan de comidas. Inténtalo de nuevo."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!plan) return;

    try {
      const updatedPlan = await toggleFavorite(plan.id, !plan.isFavorite);
      setPlan(updatedPlan);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      showErrorToast("Error", "No se pudo actualizar el favorito.");
    }
  };

  const handleSharePlan = async () => {
    if (!plan) return;

    try {
      const shareContent = `🍽️ Mi Plan de Comidas de Aira 🍽️\n\n${
        plan.planTitle
      }\n\nCreado el ${formatDate(
        plan.createdAt
      )}\n\n¡Descubre Aira y crea tu propio plan de comidas personalizado!`;

      await Share.share({
        message: shareContent,
        title: plan.planTitle,
      });
    } catch (error) {
      console.error("Error sharing daily meal plan:", error);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const renderActions = () => {
    if (!plan) return null;

    return (
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.headerActionButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={plan.isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={AiraColors.foreground}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerActionButton}
          onPress={handleSharePlan}
        >
          <Ionicons name="share" size={20} color={AiraColors.foreground} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerActionButton}
          onPress={handleDeletePlan}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={AiraColors.foreground} />
          ) : (
            <Ionicons name="trash" size={20} color={AiraColors.foreground} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderPlanContent = () => {
    if (!plan) return null;

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.titleCard}>
            <LinearGradient
              colors={[
                AiraColorsWithAlpha.accentWithOpacity(0.1),
                AiraColorsWithAlpha.primaryWithOpacity(0.05),
              ]}
              style={styles.titleGradient}
            >
              <ThemedText style={styles.planTitle}>{plan.planTitle}</ThemedText>
              {plan.introduction && (
                <ThemedText style={styles.introduction}>
                  {plan.introduction}
                </ThemedText>
              )}
            </LinearGradient>
          </View>

          <View style={styles.mealsSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="restaurant" size={20} color={AiraColors.accent} />
              <ThemedText style={styles.sectionTitle}>
                Tu Plan de Comidas
              </ThemedText>
            </View>

            {plan.meals.map((meal, index) => (
              <View key={index} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <ThemedText style={styles.mealType}>
                    {meal.mealType}
                  </ThemedText>
                </View>
                <View style={styles.mealOptions}>
                  {meal.options.map((option, optionIndex) => (
                    <View key={optionIndex} style={styles.optionItem}>
                      <View style={styles.optionBullet} />
                      <ThemedText style={styles.optionText}>
                        {option}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {plan.generalTips && (
            <View style={styles.tipsSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="bulb" size={20} color={AiraColors.primary} />
                <ThemedText style={styles.sectionTitle}>
                  Consejos Generales
                </ThemedText>
              </View>
              <View style={styles.tipsCard}>
                <ThemedText style={styles.tipsText}>
                  {plan.generalTips}
                </ThemedText>
              </View>
            </View>
          )}

          {plan.suggestedNextActions &&
            plan.suggestedNextActions.length > 0 && (
              <View style={styles.actionsSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="compass"
                    size={20}
                    color={AiraColors.accent}
                  />
                  <ThemedText style={styles.sectionTitle}>
                    Próximas Acciones
                  </ThemedText>
                </View>
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

          <View style={styles.metadataSection}>
            <View style={styles.metadataCard}>
              <View style={styles.metadataRow}>
                <Ionicons
                  name="time"
                  size={16}
                  color={AiraColors.mutedForeground}
                />
                <ThemedText style={styles.metadataLabel}>Creado:</ThemedText>
                <ThemedText style={styles.metadataValue}>
                  {formatDate(plan.createdAt)}
                </ThemedText>
              </View>

              {plan.tags.length > 0 && (
                <View style={styles.metadataRow}>
                  <Ionicons
                    name="pricetag"
                    size={16}
                    color={AiraColors.mutedForeground}
                  />
                  <ThemedText style={styles.metadataLabel}>Tags:</ThemedText>
                  <View style={styles.tagsContainer}>
                    {plan.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <ThemedText style={styles.tagText}>{tag}</ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {plan.inputParameters.dietaryPreferences && (
                <View style={styles.metadataRow}>
                  <Ionicons
                    name="leaf"
                    size={16}
                    color={AiraColors.mutedForeground}
                  />
                  <ThemedText style={styles.metadataLabel}>
                    Preferencias:
                  </ThemedText>
                  <ThemedText style={styles.metadataValue}>
                    {plan.inputParameters.dietaryPreferences}
                  </ThemedText>
                </View>
              )}

              {plan.inputParameters.mainGoal && (
                <View style={styles.metadataRow}>
                  <Ionicons
                    name="flag"
                    size={16}
                    color={AiraColors.mutedForeground}
                  />
                  <ThemedText style={styles.metadataLabel}>
                    Objetivo:
                  </ThemedText>
                  <ThemedText style={styles.metadataValue}>
                    {plan.inputParameters.mainGoal}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderLoadingView = () => (
    <View style={styles.centerContainer}>
      <LinearGradient
        colors={[AiraColors.accent, AiraColors.primary]}
        style={styles.loadingCard}
      >
        <ActivityIndicator size="large" color="white" />
        <ThemedText style={styles.loadingTitle}>
          Cargando plan de comidas...
        </ThemedText>
        <ThemedText style={styles.loadingSubtitle}>
          Preparando tu menú personalizado
        </ThemedText>
      </LinearGradient>
    </View>
  );

  const renderErrorView = () => (
    <View style={styles.centerContainer}>
      <View style={styles.errorCard}>
        <Ionicons
          name="alert-circle"
          size={48}
          color={AiraColors.destructive}
        />
        <ThemedText style={styles.errorTitle}>
          Error al cargar el plan
        </ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error || "Ocurrió un error inesperado"}
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={loadPlan}>
          <LinearGradient
            colors={[AiraColors.accent, AiraColors.primary]}
            style={styles.retryButtonGradient}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <ThemedText style={styles.retryButtonText}>
              Intentar de nuevo
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNotFoundView = () => (
    <View style={styles.centerContainer}>
      <View style={styles.errorCard}>
        <Ionicons
          name="restaurant"
          size={48}
          color={AiraColors.mutedForeground}
        />
        <ThemedText style={styles.errorTitle}>
          Plan de comidas no encontrado
        </ThemedText>
        <ThemedText style={styles.errorMessage}>
          El plan de comidas que buscas no existe o ya no está disponible
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={handleGoBack}>
          <LinearGradient
            colors={[AiraColors.accent, AiraColors.primary]}
            style={styles.retryButtonGradient}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
            <ThemedText style={styles.retryButtonText}>
              Volver a planes
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (viewState) {
      case "loading":
        return renderLoadingView();
      case "error":
        return renderErrorView();
      case "not-found":
        return renderNotFoundView();
      case "loaded":
        return renderPlanContent();
      default:
        return renderLoadingView();
    }
  };

  return (
    <PageView>
      <Topbar
        title={plan?.planTitle || "Plan de Comidas"}
        showBackButton={true}
        onBack={handleGoBack}
        actions={renderActions()}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {renderContent()}
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  headerIcon: {
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 24,
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  titleCard: {
    margin: 20,
    marginBottom: 16,
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  titleGradient: {
    padding: 20,
    alignItems: "center",
  },
  planTitle: {
    fontSize: 20,
    color: AiraColors.foreground,
    textAlign: "center",
    marginBottom: 8,
  },
  introduction: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,

    color: AiraColors.foreground,
  },
  mealsSection: {
    marginBottom: 24,
  },
  mealCard: {
    backgroundColor: AiraColors.card,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    borderWidth: 1,
    borderColor: AiraColors.border,
  },
  mealHeader: {
    marginBottom: 12,
  },
  mealType: {
    fontSize: 16,

    color: AiraColors.accent,
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
    backgroundColor: AiraColors.primary,
    marginTop: 6,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  tipsSection: {
    marginBottom: 24,
  },
  tipsCard: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    marginHorizontal: 20,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
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
    paddingHorizontal: 20,
  },
  actionButton: {
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.accentWithOpacity(0.2),
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    color: AiraColors.accent,
  },
  metadataSection: {
    marginBottom: 40,
  },
  metadataCard: {
    backgroundColor: AiraColors.card,
    marginHorizontal: 20,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    borderWidth: 1,
    borderColor: AiraColors.border,
    gap: 12,
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  metadataLabel: {
    fontSize: 14,

    color: AiraColors.mutedForeground,
    minWidth: 80,
  },
  metadataValue: {
    flex: 1,
    fontSize: 14,
    color: AiraColors.foreground,
  },
  tagsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 12,
    color: AiraColors.accent,
  },
  centerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  loadingCard: {
    padding: 40,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
    gap: 16,
  },
  loadingTitle: {
    fontSize: 20,

    color: "white",
    textAlign: "center",
  },
  loadingSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 22,
  },
  errorCard: {
    backgroundColor: AiraColors.card,
    padding: 32,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  errorTitle: {
    fontSize: 20,

    color: AiraColors.foreground,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
    marginTop: 8,
  },
  retryButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,

    color: "white",
  },
});
