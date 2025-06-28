import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { DailyMealPlanForm } from "@/components/ui/DailyMealPlanForm";
import { GeneratedDailyMealPlanSection } from "@/components/ui/GeneratedDailyMealPlanSection";
import { ExistingDailyMealPlansSection } from "@/components/ui/ExistingDailyMealPlansSection";
import { PlanHeader } from "@/components/ui/PlanHeader";
import { PlanLoadingView } from "@/components/ui/PlanLoadingView";
import { PlanErrorView } from "@/components/ui/PlanErrorView";
import { PlanOptionCard } from "@/components/ui/PlanOptionCard";
import { PlanWelcomeSection } from "@/components/ui/PlanWelcomeSection";
import { useDailyMealPlans } from "@/hooks/services/useDailyMealPlans";
import { usePersonalizedPlan } from "@/hooks/usePersonalizedPlan";
import { DailyMealPlanInput, DailyMealPlanOutput } from "@/types/Assistant";
import { PageView } from "@/components/ui/PageView";

type ViewState = "main" | "form" | "generated" | "loading" | "error";

export default function DailyMealPlanScreen() {
  const { user } = useUser();
  const {
    plans,
    createPlan: createDailyMealPlan,
    deletePlan,
    loading: isSavingDailyMealPlan,
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

  const renderMainView = () => (
    <View style={styles.mainContainer}>
      <PlanWelcomeSection
        title="¡Vamos a crear tu menú perfecto! 🍽️"
        description="Aira te ayudará a generar un plan de comidas delicioso y nutritivo, adaptado a tus preferencias y necesidades específicas."
        iconName="restaurant"
        iconColor={AiraColors.accent}
      />

      <View style={styles.optionsContainer}>
        <PlanOptionCard
          title="Generación Rápida"
          description="Plan saludable y equilibrado automático"
          iconName="flash"
          onPress={handleQuickGenerate}
          variant="gradient"
          gradientColors={[AiraColors.accent, AiraColors.primary]}
          disabled={isGenerating}
        />

        <PlanOptionCard
          title="Personalización Completa"
          description="Configura preferencias, alergias y objetivos"
          iconName="create"
          onPress={handleCustomGenerate}
          variant="outline"
          gradientColors={[AiraColors.accent, AiraColors.primary]}
          disabled={isGenerating}
        />
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
    <PlanLoadingView
      title="Generando tu plan de comidas"
      subtitle="Aira está creando un menú delicioso y nutritivo especialmente para ti..."
      useGradient
      gradientColors={[AiraColors.accent, AiraColors.primary]}
      indicatorColor="white"
    />
  );

  const renderErrorView = () => (
    <PlanErrorView
      title="Error al generar el plan"
      message={error || "Ocurrió un error inesperado"}
      onRetry={handleRetry}
      retryText="Intentar de nuevo"
      iconName="alert-circle"
      useGradientButton
      gradientColors={[AiraColors.accent, AiraColors.primary]}
    />
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

  const config = getHeaderConfig();

  return (
    <PageView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <PlanHeader
          title={config.title}
          subtitle={config.subtitle}
          onBack={handleGoBack}
          showBack={config.showBack}
          gradientColors={[AiraColors.accent, AiraColors.primary]}
          disabled={isGenerating}
        />
        {renderContent()}
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },

  mainContainer: {
    flex: 1,
    padding: 20,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
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
});
