import React, { memo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

// Categorías de ejercicios - Sincronizadas con ExercisesGallery
const categories = [
  {
    id: "biceps",
    name: "Biceps",
    icon: "fitness-outline",
    color: AiraColors.primary,
    image: require("@/assets/images/exercises/biceps.jpg"),
  },
  {
    id: "espalda",
    name: "Espalda",
    icon: "body-outline",
    color: "#60a5fa",
    image: require("@/assets/images/exercises/back.jpg"),
  },
  {
    id: "hombros",
    name: "Hombros",
    icon: "barbell-outline",
    color: "#34d399",
    image: require("@/assets/images/exercises/shoulders.jpg"),
  },
  {
    id: "pecho",
    name: "Pecho",
    icon: "expand-outline",
    color: "#f87171",
    image: require("@/assets/images/exercises/chest.jpg"),
  },
  {
    id: "piernas",
    name: "Piernas",
    icon: "walk-outline",
    color: "#f59e0b",
    image: require("@/assets/images/exercises/legs.jpg"),
  },
  {
    id: "triceps",
    name: "Triceps",
    icon: "fitness-outline",
    color: "#a78bfa",
    image: require("@/assets/images/exercises/triceps.jpg"),
  },
];

// Definición de entrenamientos populares
const popularWorkouts = [
  {
    id: "1",
    title: "Full Body Workout",
    duration: "45 min",
    calories: "320 kcal",
    image: require("@/assets/images/exercises/shoulders.jpg"),
  },
  {
    id: "2",
    title: "Upper Body Strength",
    duration: "30 min",
    calories: "280 kcal",
    image: require("@/assets/images/exercises/chest.jpg"),
  },
  {
    id: "3",
    title: "Core Crusher",
    duration: "20 min",
    calories: "180 kcal",
    image: require("@/assets/images/exercises/legs.jpg"),
  },
];

const CategoryCard = memo(
  ({
    category,
    isSelected,
    onPress,
  }: {
    category: (typeof categories)[0];
    isSelected: boolean;
    onPress: (id: string) => void;
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          { borderColor: isSelected ? category.color : "transparent" },
        ]}
        onPress={() => onPress(category.id)}
        activeOpacity={0.7}
      >
        <Image source={category.image} style={styles.categoryImage} />
        <View style={[styles.categoryOverlay]}>
          <View style={styles.categoryIconWrapper}>
            <Ionicons name={category.icon as any} size={28} color="white" />
          </View>

          <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
        </View>
      </TouchableOpacity>
    );
  }
);

CategoryCard.displayName = "CategoryCard";

/**
 * Componente memoizado para renderizar cada entrenamiento popular
 */
const WorkoutCard = memo(
  ({
    workout,
    onPress,
  }: {
    workout: (typeof popularWorkouts)[0];
    onPress: (id: string) => void;
  }) => {
    return (
      <TouchableOpacity
        style={styles.workoutCard}
        onPress={() => onPress(workout.id)}
      >
        <Image source={workout.image} style={styles.workoutImage} />
        <View style={styles.workoutOverlay}>
          <ThemedText style={styles.workoutTitle}>{workout.title}</ThemedText>
          <View style={styles.workoutDetails}>
            <View style={styles.workoutDetail}>
              <Ionicons name="flame-outline" size={14} color="white" />
              <ThemedText style={styles.workoutDetailText}>
                {workout.calories}
              </ThemedText>
            </View>
            <View style={styles.workoutDetail}>
              <Ionicons name="time-outline" size={14} color="white" />
              <ThemedText style={styles.workoutDetailText}>
                {workout.duration}
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

WorkoutCard.displayName = "WorkoutCard";

interface ExercisesDashboardProps {
  onViewAllExercises: () => void;
  onSelectCategory: (categoryId: string) => void;
}

const ExercisesDashboard: React.FC<ExercisesDashboardProps> = ({
  onViewAllExercises,
  onSelectCategory,
}) => {
  // Función para navegar al entrenamiento seleccionado
  const handleWorkoutPress = (workoutId: string) => {
    // Implementar navegación al detalle del entrenamiento
    console.log(`Navegando al entrenamiento ${workoutId}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Sección de categorías */}
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>
          Categorías de Ejercicios
        </ThemedText>
        <TouchableOpacity onPress={onViewAllExercises}>
          <ThemedText style={styles.seeAllText}>Ver todo</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesGridContainer}>
        <FlatList
          horizontal={false}
          scrollEnabled={false}
          numColumns={2}
          columnWrapperStyle={styles.categoriesContainer}
          data={categories}
          keyExtractor={(item: (typeof categories)[0]) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: { item: (typeof categories)[0] }) => (
            <CategoryCard
              category={item}
              isSelected={false}
              onPress={onSelectCategory}
            />
          )}
        />
      </View>

      {/* Sección de entrenamientos populares */}
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>
          Entrenamientos Populares
        </ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.seeAllText}>Ver todo</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.workoutsContainer}
      >
        {popularWorkouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onPress={handleWorkoutPress}
          />
        ))}
      </ScrollView>

      {/* Programa destacado */}
      <TouchableOpacity style={styles.featuredProgramContainer}>
        <View style={styles.featuredProgramContent}>
          <ThemedText
            type="defaultSemiBold"
            style={styles.featuredProgramTitle}
          >
            Programa Destacado
          </ThemedText>
          <ThemedText style={styles.featuredProgramSubtitle}>
            6 semanas • 24 entrenamientos
          </ThemedText>
        </View>
        <Image
          source={require("@/assets/images/exercises/back.jpg")}
          style={styles.featuredProgramImage}
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.card,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    color: AiraColors.foreground,
  },
  seeAllText: {
    fontSize: 14,
    color: AiraColors.primary,
  },
  categoriesContainer: {
    gap: 8,
    padding: 8,
  },
  categoriesGridContainer: {
    marginBottom: 16,
  },
  categoryCard: {
    flex: 0.5,
    aspectRatio: 1,
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
    justifyContent: "flex-end",
  },
  categoryIconWrapper: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 16,
    color: "white",
    marginBottom: 4,
  },
  workoutsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  workoutCard: {
    width: 280,
    height: 160,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  workoutImage: {
    width: "100%",
    height: "100%",
  },
  workoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
    justifyContent: "flex-end",
  },
  workoutTitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 4,
  },
  workoutDetails: {
    flexDirection: "row",
  },
  workoutDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  workoutDetailText: {
    fontSize: 12,
    color: "white",
    marginLeft: 4,
  },
  featuredProgramContainer: {
    margin: 16,
   
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.5),
  },
  featuredProgramContent: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  featuredProgramTitle: {
    fontSize: 18,
    color: AiraColors.foreground,
  },
  featuredProgramSubtitle: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginTop: 4,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: AiraColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  startButtonText: {
    color: "white",
    fontSize: 14,
  },
  featuredProgramImage: {
    flex: 1,
    aspectRatio: 1,
    resizeMode: "cover",
  },
});

export default ExercisesDashboard;
