import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
  ColorValue,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { GeneratedPlanSection } from "@/components/ui/GeneratedPlanSection";
import { useGeneratedPlans } from "@/hooks/services/useGeneratedPlans";
import { GeneratedPlan } from "@/services/api/generatedPlan.service";

type ViewState = "loading" | "loaded" | "error" | "not-found";

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    plans,
    deletePlan,
    updatePlan,
    loading: plansLoading,
  } = useGeneratedPlans();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

      // Buscar el plan en la lista cargada
      const planData = plans.find((p) => p.id === id);

      if (!planData) {
        setViewState("not-found");
        setError("Plan no encontrado");
        return;
      }

      setPlan(planData);
      setViewState("loaded");
    } catch (err) {
      console.error("Error loading plan:", err);
      setError(err instanceof Error ? err.message : "Error al cargar el plan");
      setViewState("error");
    }
  };

  const handleDeletePlan = async () => {
    if (!plan) return;

    Alert.alert(
      "Eliminar Plan",
      `¿Estás segura de que quieres eliminar "${plan.title}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: confirmDeletePlan,
        },
      ]
    );
  };

  const confirmDeletePlan = async () => {
    if (!plan) return;

    try {
      setIsDeleting(true);
      await deletePlan(plan.id);

      Alert.alert("Plan Eliminado", "El plan se ha eliminado correctamente", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error deleting plan:", error);
      Alert.alert("Error", "No se pudo eliminar el plan. Inténtalo de nuevo.", [
        { text: "OK" },
      ]);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdatePlan = async (updates: Partial<GeneratedPlan>) => {
    if (!plan) return;

    try {
      setIsUpdating(true);
      const allowedUpdates = {
        title: updates.title,
        tags: updates.tags,
        notes: updates.notes,
      };

      await updatePlan(plan.id, allowedUpdates);
      setPlan((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error("Error updating plan:", error);
      Alert.alert(
        "Error",
        "No se pudo actualizar el plan. Inténtalo de nuevo.",
        [{ text: "OK" }]
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSharePlan = async () => {
    if (!plan) return;

    try {
      const shareContent = `🌟 Mi Plan Personalizado de Aira 🌟\n\n${
        plan.title
      }\n\nCreado el ${formatDate(
        plan.createdAt
      )}\n\n¡Descubre Aira y crea tu propio plan personalizado!`;

      await Share.share({
        message: shareContent,
        title: plan.title,
      });
    } catch (error) {
      console.error("Error sharing plan:", error);
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

  const getPlanTypeConfig = (type: string) => {
    switch (type) {
      case "comprehensive":
        return {
          title: "Plan Integral",
          icon: "person",
          colors: [AiraColors.primary, AiraColors.accent],
        };
      case "nutrition":
        return {
          title: "Plan Nutricional",
          icon: "restaurant",
          colors: ["#10B981", "#059669"],
        };
      case "workout":
        return {
          title: "Plan de Entrenamiento",
          icon: "fitness",
          colors: ["#3B82F6", "#1D4ED8"],
        };
      case "wellness":
        return {
          title: "Plan de Bienestar",
          icon: "heart",
          colors: ["#F59E0B", "#D97706"],
        };
      default:
        return {
          title: "Plan",
          icon: "document",
          colors: [AiraColors.mutedForeground, AiraColors.muted],
        };
    }
  };

  const renderHeader = () => {
    const config = plan
      ? getPlanTypeConfig(plan.planType)
      : {
          title: "Plan",
          icon: "document",
          colors: [AiraColors.primary, AiraColors.accent],
        };

    return (
      <LinearGradient
        colors={config.colors as [ColorValue, ColorValue, ...ColorValue[]]}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]} style={styles.headerContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
              <View style={styles.headerTitleRow}>
                <Ionicons
                  name={config.icon as any}
                  size={24}
                  color="white"
                  style={styles.headerIcon}
                />
                <ThemedText style={styles.headerTitle}>
                  {config.title}
                </ThemedText>
              </View>
              {plan && (
                <ThemedText style={styles.headerSubtitle}>
                  Creado el {formatDate(plan.createdAt)}
                </ThemedText>
              )}
            </View>

            {plan && (
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.headerActionButton}
                  onPress={handleSharePlan}
                >
                  <Ionicons name="share" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.headerActionButton}
                  onPress={handleDeletePlan}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="trash" size={20} color="white" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  };

  const renderLoadingView = () => (
    <View style={styles.centerContainer}>
      <LinearGradient
        colors={[AiraColors.primary, AiraColors.accent]}
        style={styles.loadingCard}
      >
        <ActivityIndicator size="large" color="white" />
        <ThemedText style={styles.loadingTitle}>Cargando plan...</ThemedText>
        <ThemedText style={styles.loadingSubtitle}>
          Preparando tu plan personalizado
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
            colors={[AiraColors.primary, AiraColors.accent]}
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
          name="document-text"
          size={48}
          color={AiraColors.mutedForeground}
        />
        <ThemedText style={styles.errorTitle}>Plan no encontrado</ThemedText>
        <ThemedText style={styles.errorMessage}>
          El plan que buscas no existe o ya no está disponible
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={handleGoBack}>
          <LinearGradient
            colors={[AiraColors.primary, AiraColors.accent]}
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

  const renderPlanContent = () => {
    if (!plan) return null;

    return (
      <GeneratedPlanSection
        plan={plan.planData}
        inputParams={
          plan.inputParameters || {
            age: 30,
            sexo: "Femenino",
            altura: 165,
            peso: 65,
            objetivo: "Bienestar general",
          }
        }
        onSave={async () => {
          Alert.alert(
            "Plan Guardado",
            "Este plan ya está guardado en tu biblioteca",
            [{ text: "OK" }]
          );
        }}
        onRegenerate={() => {
          Alert.alert(
            "Regenerar Plan",
            "Para regenerar este plan, ve a la sección de generación de planes",
            [{ text: "OK" }]
          );
        }}
        isSaving={false}
        isRegenerating={false}
        isFromCompleteProfile={plan.isFromCompleteProfile}
      />
    );
  };

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
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
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
    fontWeight: "700",
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
    fontWeight: "600",
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
    fontWeight: "600",
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
    borderRadius: AiraVariants.buttonRadius,
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
    fontWeight: "600",
    color: "white",
  },
});
