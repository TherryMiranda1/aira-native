import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { DailyMealPlanForm } from "@/components/ui/DailyMealPlanForm";
import { GeneratedDailyMealPlanSection } from "@/components/ui/GeneratedDailyMealPlanSection";
import { ExistingDailyMealPlansSection } from "@/components/ui/ExistingDailyMealPlansSection";
import { useDailyMealPlans } from "@/hooks/services/useDailyMealPlans";
import { usePersonalizedPlan } from "@/hooks/usePersonalizedPlan";
import { DailyMealPlanInput, DailyMealPlanOutput } from "@/types/Assistant";

type ViewState = "main" | "form" | "generated" | "loading" | "error";

export default function DailyMealPlanScreen() {
  const { user } = useUser();
  const { 
    plans,
    createPlan: createDailyMealPlan, 
    deletePlan,
    loading: isSavingDailyMealPlan 
  } = useDailyMealPlans();
  const { generateDailyMealPlan } = usePersonalizedPlan();

  const [viewState, setViewState] = useState<ViewState>("main");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [generatedDailyMealPlan, setGeneratedDailyMealPlan] =
    useState<DailyMealPlanOutput | null>(null);
  const [dailyMealPlanInputParams, setDailyMealPlanInputParams] =
    useState<DailyMealPlanInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuickGenerate = async () => {
    if (!user) {
      Alert.alert(
        "Error",
        "Debes iniciar sesión para generar un plan de comidas"
      );
      return;
    }

    setIsGenerating(true);
    setViewState("loading");
    setError(null);

    try {
      const defaultInput: DailyMealPlanInput = {
        userInput:
          "Necesito un plan de comidas saludable y equilibrado para hoy",
        mainGoal: "Bienestar general",
      };

      const plan = await generateDailyMealPlan(defaultInput);
      setGeneratedDailyMealPlan(plan);
      setDailyMealPlanInputParams(defaultInput);
      setViewState("generated");
    } catch (error) {
      console.error("Error generando plan rápido:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setViewState("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomGenerate = () => {
    setViewState("form");
  };

  const handleFormSubmit = async (formData: DailyMealPlanInput) => {
    setIsGenerating(true);
    setViewState("loading");
    setError(null);

    try {
      const plan = await generateDailyMealPlan(formData);
      setGeneratedDailyMealPlan(plan);
      setDailyMealPlanInputParams(formData);
      setViewState("generated");
    } catch (error) {
      console.error("Error generando plan de comidas diarias:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setViewState("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDailyMealPlan = async () => {
    if (!generatedDailyMealPlan || !dailyMealPlanInputParams) return;

    try {
      await createDailyMealPlan({
        planTitle: generatedDailyMealPlan.planTitle,
        planData: generatedDailyMealPlan,
        inputParameters: dailyMealPlanInputParams,
        tags: ["plan-diario", "comidas"],
      });

      Alert.alert(
        "Plan de Comidas Guardado",
        "Tu plan de comidas se ha guardado exitosamente en tu biblioteca",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error guardando plan de comidas:", error);
      Alert.alert(
        "Error",
        "No se pudo guardar el plan de comidas. Inténtalo de nuevo.",
        [{ text: "OK" }]
      );
      throw error;
    }
  };

  const handleRegenerate = async () => {
    if (!dailyMealPlanInputParams) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const plan = await generateDailyMealPlan(dailyMealPlanInputParams);
      setGeneratedDailyMealPlan(plan);
    } catch (error) {
      console.error("Error regenerando plan de comidas:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleEditParams = () => {
    setViewState("form");
  };

  const handleGoBack = () => {
    if (viewState === "form") {
      setViewState("main");
    } else if (viewState === "generated") {
      setViewState("main");
      setGeneratedDailyMealPlan(null);
      setDailyMealPlanInputParams(null);
    } else if (viewState === "error") {
      setViewState("main");
      setError(null);
    } else {
      router.back();
    }
  };

  const handleRetry = () => {
    if (dailyMealPlanInputParams) {
      handleFormSubmit(dailyMealPlanInputParams);
    } else {
      handleQuickGenerate();
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deletePlan(planId);
    } catch (error) {
      console.error("Error eliminando plan:", error);
      Alert.alert("Error", "No se pudo eliminar el plan.", [{ text: "OK" }]);
    }
  };

  const renderHeader = () => {
    const getHeaderConfig = () => {
      switch (viewState) {
        case "form":
          return {
            title: "Configurar Plan de Comidas",
            subtitle: "Personaliza tu menú diario",
            showBack: true,
          };
        case "generated":
          return {
            title: "Tu Plan de Comidas",
            subtitle: "Generado por Aira",
            showBack: true,
          };
        case "loading":
          return {
            title: "Generando Plan",
            subtitle: "Aira está creando tu menú personalizado...",
            showBack: false,
          };
        case "error":
          return {
            title: "Error",
            subtitle: "Hubo un problema generando tu plan",
            showBack: true,
          };
        default:
          return {
            title: "Plan de Comidas Diarias",
            subtitle: "Genera tu menú perfecto para hoy",
            showBack: true,
          };
      }
    };

    const config = getHeaderConfig();

    return (
      <LinearGradient
        colors={[AiraColors.accent, AiraColors.primary]}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]} style={styles.headerContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <ThemedText style={styles.headerTitle}>{config.title}</ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                {config.subtitle}
              </ThemedText>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  };

  const renderMainView = () => (
    <View style={styles.mainContainer}>
      <View style={styles.welcomeSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="restaurant" size={48} color={AiraColors.accent} />
        </View>
        <ThemedText style={styles.welcomeTitle}>
          ¡Vamos a crear tu menú perfecto! 🍽️
        </ThemedText>
        <ThemedText style={styles.welcomeDescription}>
          Aira te ayudará a generar un plan de comidas delicioso y nutritivo,
          adaptado a tus preferencias y necesidades específicas.
        </ThemedText>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleQuickGenerate}
          disabled={isGenerating}
        >
          <LinearGradient
            colors={[AiraColors.accent, AiraColors.primary]}
            style={styles.optionGradient}
          >
            <Ionicons name="flash" size={32} color="white" />
            <ThemedText style={styles.optionTitle}>
              Generación Rápida
            </ThemedText>
            <ThemedText style={styles.optionDescription}>
              Plan saludable y equilibrado automático
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleCustomGenerate}
          disabled={isGenerating}
        >
          <View style={styles.optionOutline}>
            <Ionicons name="create" size={32} color={AiraColors.accent} />
            <ThemedText style={styles.optionTitleOutline}>
              Personalización Completa
            </ThemedText>
            <ThemedText style={styles.optionDescriptionOutline}>
              Configura preferencias, alergias y objetivos
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      {!user && (
        <View style={styles.authWarning}>
          <Ionicons name="warning" size={20} color={AiraColors.destructive} />
          <ThemedText style={styles.authWarningText}>
            Debes iniciar sesión para generar planes de comidas
          </ThemedText>
        </View>
      )}

      {plans?.length > 0 && (
        <ExistingDailyMealPlansSection 
          plans={plans} 
          onPlanDelete={handleDeletePlan}
        />
      )}
    </View>
  );

  const renderLoadingView = () => (
    <View style={styles.loadingContainer}>
      <LinearGradient
        colors={[AiraColors.accent, AiraColors.primary]}
        style={styles.loadingGradient}
      >
        <ActivityIndicator size="large" color="white" />
        <ThemedText style={styles.loadingTitle}>
          Generando tu plan de comidas
        </ThemedText>
        <ThemedText style={styles.loadingSubtitle}>
          Aira está creando un menú delicioso y nutritivo especialmente para
          ti...
        </ThemedText>
      </LinearGradient>
    </View>
  );

  const renderErrorView = () => (
    <View style={styles.errorContainer}>
      <View style={styles.errorCard}>
        <Ionicons
          name="alert-circle"
          size={48}
          color={AiraColors.destructive}
        />
        <ThemedText style={styles.errorTitle}>
          Error al generar el plan
        </ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error || "Ocurrió un error inesperado"}
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
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

  const renderContent = () => {
    switch (viewState) {
      case "form":
        return (
          <DailyMealPlanForm
            onSubmit={handleFormSubmit}
            isLoading={isGenerating}
            initialData={dailyMealPlanInputParams || undefined}
          />
        );
      case "generated":
        return generatedDailyMealPlan && dailyMealPlanInputParams ? (
          <GeneratedDailyMealPlanSection
            plan={generatedDailyMealPlan}
            inputParams={dailyMealPlanInputParams}
            onSave={handleSaveDailyMealPlan}
            onRegenerate={handleRegenerate}
            onEditParams={handleEditParams}
            isSaving={isSavingDailyMealPlan}
            isRegenerating={isRegenerating}
          />
        ) : null;
      case "loading":
        return renderLoadingView();
      case "error":
        return renderErrorView();
      default:
        return renderMainView();
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </ScrollView>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AiraColors.foreground,
    textAlign: "center",
    marginBottom: 12,
  },
  welcomeDescription: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  optionGradient: {
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  optionOutline: {
    padding: 24,
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: AiraColors.accent,
    borderRadius: AiraVariants.cardRadius,
    backgroundColor: AiraColors.background,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  optionTitleOutline: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.accent,
    textAlign: "center",
  },
  optionDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  optionDescriptionOutline: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
  },
  authWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    backgroundColor: AiraColorsWithAlpha.destructiveWithOpacity(0.1),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.destructiveWithOpacity(0.2),
  },
  authWarningText: {
    fontSize: 14,
    color: AiraColors.destructive,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  loadingGradient: {
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
  errorContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
    fontWeight: "600",
    color: "white",
  },
});
