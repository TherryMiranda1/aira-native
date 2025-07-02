import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ModalScreen } from "@/components/navigation/ModalScreen";
import { recipeService, Recipe } from "@/services/api/recipe.service";
import { EmptyState } from "@/components/States/EmptyState";
import { LoadingState } from "@/components/States/LoadingState";
import { ScheduleEventModal } from "@/components/modals/ScheduleEventModal";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [scheduleModal, setScheduleModal] = useState({
    visible: false,
    recipeId: "",
    recipeTitle: "",
  });

  useEffect(() => {
    async function fetchRecipe() {
      if (!id) {
        setError("ID de receta no proporcionado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const recipeData = await recipeService.getRecipeById(id as string);
        setRecipe(recipeData);
      } catch (err) {
        console.error("Error al cargar la receta:", err);
        setError("No pudimos cargar la receta. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  const preparationSteps = recipe?.preparacion
    ? recipe.preparacion.includes("\n")
      ? recipe.preparacion
          .split("\n\n")
          .filter((step) => step.trim().length > 0)
      : recipe.preparacion
          .split(/\d+\./)
          .filter((step) => step.trim().length > 0)
    : [];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleScheduleRecipe = () => {
    if (recipe) {
      setScheduleModal({
        visible: true,
        recipeId: recipe.id,
        recipeTitle: recipe.titulo,
      });
    }
  };

  const handleCloseScheduleModal = () => {
    setScheduleModal({
      visible: false,
      recipeId: "",
      recipeTitle: "",
    });
  };

  if (loading) {
    return (
      <ModalScreen title="">
        <LoadingState />
      </ModalScreen>
    );
  }

  if (error || !recipe) {
    return (
      <ModalScreen title="">
        <EmptyState
          title="Receta no encontrada"
          description="Lo siento, no pudimos encontrar la receta que buscas."
          buttonText="Volver"
          onPress={() => router.back()}
        />
      </ModalScreen>
    );
  }

  return (
    <ModalScreen title="">
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {recipe.imagen && (
            <Image
              source={{ uri: recipe.imagen }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.heroOverlay}>
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={handleScheduleRecipe}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={toggleFavorite}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  color={isFavorite ? "#FF6B6B" : "#fff"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {recipe.titulo}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {recipe.ingrediente_principal}
            </ThemedText>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons
                name="time-outline"
                size={16}
                color={AiraColors.mutedForeground}
              />
              <ThemedText style={styles.statText}>
                {recipe.tiempo_preparacion}
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="flame-outline"
                size={16}
                color={AiraColors.mutedForeground}
              />
              <ThemedText style={styles.statText}>
                {recipe.calorias} cal
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="bar-chart-outline"
                size={16}
                color={AiraColors.mutedForeground}
              />
              <ThemedText style={styles.statText}>
                {recipe.dificultad}
              </ThemedText>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Ingredientes
            </ThemedText>
            <View style={styles.ingredientsList}>
              {recipe.ingredientes.map((ingrediente, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.ingredientDot} />
                  <View style={styles.ingredientContent}>
                    <ThemedText style={styles.ingredientName}>
                      {ingrediente.item}
                    </ThemedText>
                    <ThemedText style={styles.ingredientAmount}>
                      {ingrediente.cantidad}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Preparation */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Preparación
            </ThemedText>
            <View style={styles.stepsList}>
              {preparationSteps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <ThemedText style={styles.stepNumberText}>
                      {index + 1}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.stepText}>{step.trim()}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Schedule Modal */}
      <ScheduleEventModal
        visible={scheduleModal.visible}
        onClose={handleCloseScheduleModal}
        type="recipe"
        itemId={scheduleModal.recipeId}
        itemTitle={scheduleModal.recipeTitle}
      />
    </ModalScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    position: "relative",
    height: 280,
    backgroundColor: AiraColors.card,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  heroActions: {
    flexDirection: "row",
    gap: 12,
  },
  scheduleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: AiraColors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    color: AiraColors.foreground,
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: AiraColors.secondary,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontSize: 14,
    color: AiraColors.foreground,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: AiraColors.foreground,
    marginBottom: 20,
  },
  ingredientsList: {
    gap: 16,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AiraColors.primary,
  },
  ingredientContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ingredientName: {
    fontSize: 16,
    color: AiraColors.foreground,
    flex: 1,
  },
  ingredientAmount: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  stepsList: {
    gap: 20,
  },
  stepItem: {
    flexDirection: "row",
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AiraColors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    color: AiraColors.primaryForeground,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: AiraColors.foreground,
    lineHeight: 24,
  },
  bottomSpacing: {
    height: 40,
  },
});
