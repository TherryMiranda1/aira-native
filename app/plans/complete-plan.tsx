import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "@clerk/clerk-expo";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { PlanConfigForm } from "@/components/ui/PlanConfigForm";
import { GeneratedPlanSection } from "@/components/ui/GeneratedPlanSection";
import { ExistingPlansSection } from "@/components/ui/ExistingPlansSection";
import { useGeneratedPlans } from "@/hooks/services/useGeneratedPlans";
import { usePersonalizedPlan } from "@/hooks/usePersonalizedPlan";
import {
  PersonalizedPlanInput,
  PersonalizedPlanOutput,
} from "@/ai/flows/personalized-plan-flow";

type ViewState = "main" | "form" | "generated" | "loading" | "error";

export default function PlansScreen() {
  const { user } = useUser();
  const { plans, createPlan, loading: isSavingPlan } = useGeneratedPlans();
  const { generatePersonalizedPlan } = usePersonalizedPlan();

  const [viewState, setViewState] = useState<ViewState>("main");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] =
    useState<PersonalizedPlanOutput | null>(null);
  const [planInputParams, setPlanInputParams] =
    useState<PersonalizedPlanInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuickGenerate = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión para generar un plan");
      return;
    }

    setIsGenerating(true);
    setViewState("loading");
    setError(null);

    try {
      const defaultInput: PersonalizedPlanInput = {
        fullName: user.firstName || "Usuaria",
        age: 30,
        sexo: "Femenino",
        altura: 165,
        peso: 65,
        objetivo: "Mejora de la salud general",
        plazo: "3 meses",
        nivel_entrenamiento: "Principiante",
        sesiones_semana: "3-4 días a la semana",
        minutos_por_sesion: "30-45 minutos",
        horario_entrenamiento: "Flexible",
        presupuesto_semana: "Moderado",
        cookingAvailability: "Moderado",
        personalPriorities: "Bienestar general",
        nutritionKnowledge: "Nivel general",
      };

      const plan = await generatePersonalizedPlan(defaultInput);
      setGeneratedPlan(plan);
      setPlanInputParams(defaultInput);
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

  const handleFormSubmit = async (formData: PersonalizedPlanInput) => {
    setIsGenerating(true);
    setViewState("loading");
    setError(null);

    try {
      const plan = await generatePersonalizedPlan(formData);
      setGeneratedPlan(plan);
      setPlanInputParams(formData);
      setViewState("generated");
    } catch (error) {
      console.error("Error generando plan personalizado:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setViewState("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!generatedPlan || !planInputParams) return;

    try {
      await createPlan({
        title: `Plan personalizado - ${planInputParams.objetivo}`,
        planType: "comprehensive",
        planData: generatedPlan,
        inputParameters: planInputParams,
        isFromCompleteProfile: false,
        tags: ["personalizado"],
      });
      
      Alert.alert(
        "Plan Guardado",
        "Tu plan se ha guardado exitosamente en tu biblioteca",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error guardando plan:", error);
      Alert.alert(
        "Error",
        "No se pudo guardar el plan. Inténtalo de nuevo.",
        [{ text: "OK" }]
      );
      throw error;
    }
  };

  const handleRegenerate = async () => {
    if (!planInputParams) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const plan = await generatePersonalizedPlan(planInputParams);
      setGeneratedPlan(plan);
    } catch (error) {
      console.error("Error regenerando plan:", error);
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
      setGeneratedPlan(null);
      setPlanInputParams(null);
    } else if (viewState === "error") {
      setViewState("main");
      setError(null);
    }
  };

  const handleRetry = () => {
    if (planInputParams) {
      handleFormSubmit(planInputParams);
    } else {
      handleQuickGenerate();
    }
  };

  const renderHeader = () => {
    const getHeaderConfig = () => {
      switch (viewState) {
        case "form":
          return {
            title: "Personalizar Plan",
            subtitle: "Completa tu información",
            showBack: true,
          };
        case "generated":
          return {
            title: "Tu Plan Personalizado",
            subtitle: "Generado por Aira",
            showBack: true,
          };
        case "loading":
          return {
            title: "Generando Plan",
            subtitle: "Aira está creando tu plan personalizado...",
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
            title: "Planes Personalizados",
            subtitle: "Genera tu plan de bienestar ideal",
            showBack: false,
          };
      }
    };

    const config = getHeaderConfig();

    return (
      <LinearGradient
        colors={[AiraColors.primary, AiraColors.accent]}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]} style={styles.headerContent}>
          <View style={styles.headerRow}>
            {config.showBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleGoBack}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            )}
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
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleQuickGenerate}
          disabled={isGenerating}
        >
          <LinearGradient
            colors={[AiraColors.primary, AiraColors.accent]}
            style={styles.optionGradient}
          >
            <Ionicons name="flash" size={32} color="white" />
            <ThemedText style={styles.optionTitle}>
              Generación Rápida
            </ThemedText>
            <ThemedText style={styles.optionDescription}>
              Plan automático basado en tu perfil
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleCustomGenerate}
          disabled={isGenerating}
        >
          <View style={styles.optionOutline}>
            <Ionicons name="create" size={32} color={AiraColors.primary} />
            <ThemedText style={styles.optionTitleOutline}>
              Personalización Completa
            </ThemedText>
            <ThemedText style={styles.optionDescriptionOutline}>
              Configura todos los detalles de tu plan
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      {!user && (
        <View style={styles.authWarning}>
          <Ionicons name="warning" size={20} color={AiraColors.destructive} />  
          <ThemedText style={styles.authWarningText}>
            Debes iniciar sesión para generar planes personalizados
          </ThemedText>
        </View>
      )}

      <ExistingPlansSection plans={plans} />
    </View>
  );

  const renderLoadingView = () => (
    <View style={styles.loadingContainer}>
      <LinearGradient
        colors={[AiraColors.primary, AiraColors.accent]}
        style={styles.loadingGradient}
      >
        <ActivityIndicator size="large" color="white" />
        <ThemedText style={styles.loadingTitle}>
          Generando tu plan personalizado
        </ThemedText>
        <ThemedText style={styles.loadingSubtitle}>
          Aira está analizando tu información y creando el plan perfecto para
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

  const renderContent = () => {
    switch (viewState) {
      case "form":
        return (
          <PlanConfigForm
            onSubmit={handleFormSubmit}
            isLoading={isGenerating}
            initialData={planInputParams || undefined}
          />
        );
      case "generated":
        return generatedPlan && planInputParams ? (
          <GeneratedPlanSection
            plan={generatedPlan}
            inputParams={planInputParams}
            onSave={handleSavePlan}
            onRegenerate={handleRegenerate}
            onEditParams={handleEditParams}
            isSaving={isSavingPlan}
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
    borderColor: AiraColors.primary,
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
    color: AiraColors.primary,
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
    marginBottom: 24,
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
