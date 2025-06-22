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
import { RecipeSuggestionForm } from "@/components/ui/RecipeSuggestionForm";
import { GeneratedRecipeSection } from "@/components/ui/GeneratedRecipeSection";
import { usePersonalizedPlan } from "@/hooks/usePersonalizedPlan";
import {
  SuggestRecipeInput,
  SuggestRecipeOutput,
} from "@/types/Assistant";

type ViewState = "main" | "form" | "generated" | "loading" | "error";

export default function RecipeSuggestionScreen() {
  const { user } = useUser();
  const { generateRecipeSuggestion } = usePersonalizedPlan();

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
      Alert.alert(
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
    Alert.alert(
      "Funcionalidad próximamente",
      "La funcionalidad de guardar recetas estará disponible pronto",
      [{ text: "OK" }]
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

  const renderHeader = () => {
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

    const config = getHeaderConfig();

    return (
      <LinearGradient colors={["#F97316", "#EA580C"]} style={styles.header}>
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
          <Ionicons name="restaurant" size={48} color="#F97316" />
        </View>
        <ThemedText style={styles.welcomeTitle}>
          ¡Descubre tu próxima receta favorita! 🍽️
        </ThemedText>
        <ThemedText style={styles.welcomeDescription}>
          Aira te ayudará a encontrar recetas deliciosas y saludables,
          adaptadas a tus gustos, ingredientes disponibles y restricciones dietéticas.
        </ThemedText>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleQuickGenerate}
          disabled={isGenerating}
        >
          <LinearGradient
            colors={["#F97316", "#EA580C"]}
            style={styles.optionGradient}
          >
            <Ionicons name="flash" size={32} color="white" />
            <ThemedText style={styles.optionTitle}>
              Sugerencia Rápida
            </ThemedText>
            <ThemedText style={styles.optionDescription}>
              Receta saludable y deliciosa automática
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleCustomGenerate}
          disabled={isGenerating}
        >
          <View style={styles.optionOutline}>
            <Ionicons name="create" size={32} color="#F97316" />
            <ThemedText style={styles.optionTitleOutline}>
              Personalización Completa
            </ThemedText>
            <ThemedText style={styles.optionDescriptionOutline}>
              Configura ingredientes, tipo de cocina y más
            </ThemedText>
          </View>
        </TouchableOpacity>
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
    <View style={styles.loadingContainer}>
      <LinearGradient
        colors={["#F97316", "#EA580C"]}
        style={styles.loadingGradient}
      >
        <ActivityIndicator size="large" color="white" />
        <ThemedText style={styles.loadingTitle}>
          Generando tu receta personalizada
        </ThemedText>
        <ThemedText style={styles.loadingSubtitle}>
          Aira está creando una receta deliciosa especialmente para ti...
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
          Error al generar la receta
        </ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error || "Ocurrió un error inesperado"}
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <LinearGradient
            colors={["#F97316", "#EA580C"]}
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
    borderColor: "#F97316",
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