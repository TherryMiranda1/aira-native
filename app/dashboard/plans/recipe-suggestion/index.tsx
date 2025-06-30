import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { RecipeSuggestionForm } from "@/components/ui/RecipeSuggestionForm";
import { GeneratedRecipeSection } from "@/components/ui/GeneratedRecipeSection";
import { Topbar } from "@/components/ui/Topbar";
import { PlanLoadingView } from "@/components/ui/PlanLoadingView";
import { PlanErrorView } from "@/components/ui/PlanErrorView";
import { Button } from "@/components/ui/Button";
import { PlanWelcomeSection } from "@/components/ui/PlanWelcomeSection";
import { usePersonalizedPlan } from "@/hooks/usePersonalizedPlan";
import { SuggestRecipeInput, SuggestRecipeOutput } from "@/types/Assistant";
import { PageView } from "@/components/ui/PageView";
import { useAlertHelpers } from "@/components/ui/AlertSystem";
import { useToastHelpers } from "@/components/ui/ToastSystem";

type ViewState = "main" | "form" | "generated" | "loading" | "error";

export default function RecipeSuggestionScreen() {
  const { user } = useUser();
  const { generateRecipeSuggestion } = usePersonalizedPlan();
  const { showError } = useAlertHelpers();
  const { showInfoToast } = useToastHelpers();

  const [viewState, setViewState] = useState<ViewState>("main");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] =
    useState<SuggestRecipeOutput | null>(null);
  const [recipeInputParams, setRecipeInputParams] =
    useState<SuggestRecipeInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuickGenerate = async () => {
    if (!user) {
      showError(
        "Error",
        "Debes iniciar sesión para generar sugerencias de recetas"
      );
      return;
    }

    setIsGenerating(true);
    setViewState("loading");
    setError(null);

    try {
      const defaultInput: SuggestRecipeInput = {
        userInput: "Necesito una receta saludable y deliciosa para hoy",
        mealType: "Almuerzo",
        cookingTime: "30 minutos",
      };

      const recipe = await generateRecipeSuggestion(defaultInput);
      setGeneratedRecipe(recipe);
      setRecipeInputParams(defaultInput);
      setViewState("generated");
    } catch (error) {
      console.error("Error generando receta rápida:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setViewState("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomGenerate = () => {
    setViewState("form");
  };

  const handleFormSubmit = async (formData: SuggestRecipeInput) => {
    setIsGenerating(true);
    setViewState("loading");
    setError(null);

    try {
      const recipe = await generateRecipeSuggestion(formData);
      setGeneratedRecipe(recipe);
      setRecipeInputParams(formData);
      setViewState("generated");
    } catch (error) {
      console.error("Error generando sugerencia de receta:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setViewState("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!generatedRecipe || !recipeInputParams) return;

    // TODO: Implementar guardado de recetas cuando tengamos el servicio
    showInfoToast(
      "Funcionalidad próximamente",
      "La funcionalidad de guardar recetas estará disponible pronto"
    );
  };

  const handleRegenerate = async () => {
    if (!recipeInputParams) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const recipe = await generateRecipeSuggestion(recipeInputParams);
      setGeneratedRecipe(recipe);
    } catch (error) {
      console.error("Error regenerando sugerencia de receta:", error);
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
      setGeneratedRecipe(null);
      setRecipeInputParams(null);
    } else if (viewState === "error") {
      setViewState("main");
      setError(null);
    } else {
      router.back();
    }
  };

  const handleRetry = () => {
    if (recipeInputParams) {
      handleFormSubmit(recipeInputParams);
    } else {
      handleQuickGenerate();
    }
  };

  const getHeaderConfig = () => {
    switch (viewState) {
      case "form":
        return {
          title: "Configurar Receta",
          subtitle: "Personaliza tu sugerencia",
          showBack: true,
        };
      case "generated":
        return {
          title: "Tu Receta Sugerida",
          subtitle: "Generado por Aira",
          showBack: true,
        };
      case "loading":
        return {
          title: "Generando Receta",
          subtitle: "Aira está creando tu receta personalizada...",
          showBack: false,
        };
      case "error":
        return {
          title: "Error",
          subtitle: "Hubo un problema generando tu receta",
          showBack: true,
        };
      default:
        return {
          title: "Sugerencias de Recetas",
          subtitle: "Cocina con recetas diseñadas para ti",
          showBack: true,
        };
    }
  };

  const renderMainView = () => (
    <View style={styles.mainContainer}>
      <PlanWelcomeSection
        title="¡Descubre tu próxima receta favorita! 🍽️"
        description="Aira te ayudará a encontrar recetas deliciosas y saludables, adaptadas a tus gustos, ingredientes disponibles y restricciones dietéticas."
        iconName="restaurant"
        iconColor="#F97316"
      />

      <View style={styles.optionsContainer}>
        <Button
          variant="default"
          text="Sugerencia Rápida"
          leftIcon={<Ionicons name="flash" size={20} color={AiraColors.card} />}
          size="lg"
          fullWidth
          onPress={handleQuickGenerate}
          disabled={isGenerating}
        />

        <Button
          variant="border"
          text="Personalización Completa"
          leftIcon={
            <Ionicons name="create" size={20} color={AiraColors.foreground} />
          }
          size="lg"
          fullWidth
          onPress={handleCustomGenerate}
          disabled={isGenerating}
        />
      </View>

      {!user && (
        <View style={styles.authWarning}>
          <Ionicons name="warning" size={20} color={AiraColors.destructive} />
          <ThemedText style={styles.authWarningText}>
            Debes iniciar sesión para generar sugerencias de recetas
          </ThemedText>
        </View>
      )}
    </View>
  );

  const renderLoadingView = () => (
    <PlanLoadingView
      title="Generando tu receta personalizada"
      subtitle="Aira está creando una receta deliciosa especialmente para ti..."
    />
  );

  const renderErrorView = () => (
    <PlanErrorView
      title="Error al generar la receta"
      message={error || "Ocurrió un error inesperado"}
      onRetry={handleRetry}
    />
  );

  const renderContent = () => {
    switch (viewState) {
      case "form":
        return (
          <RecipeSuggestionForm
            onSubmit={handleFormSubmit}
            isLoading={isGenerating}
            initialData={recipeInputParams || undefined}
          />
        );
      case "generated":
        return generatedRecipe && recipeInputParams ? (
          <GeneratedRecipeSection
            recipe={generatedRecipe}
            inputParams={recipeInputParams}
            onSave={handleSaveRecipe}
            onRegenerate={handleRegenerate}
            onEditParams={handleEditParams}
            isSaving={false}
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

  const headerConfig = getHeaderConfig();

  return (
    <PageView>
      <Topbar
        title={headerConfig.title}
        showBackButton={headerConfig.showBack}
        onBack={handleGoBack}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
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
    borderColor: "#F97316",
    borderRadius: AiraVariants.cardRadius,
    backgroundColor: AiraColors.background,
  },
  optionTitle: {
    fontSize: 18,
     
    color: "white",
    textAlign: "center",
  },
  optionTitleOutline: {
    fontSize: 18,
     
    color: "#F97316",
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
    borderRadius: AiraVariants.cardRadius,
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
