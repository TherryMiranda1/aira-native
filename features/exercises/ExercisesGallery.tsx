import React, {
  useState,
  useRef,
  useCallback,
  memo,
  useEffect,
  useMemo,
} from "react";
import { View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useCategoryScroll } from "@/hooks/useCategoryScroll";
import { Ionicons } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";

import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { ThemedText } from "@/components/ThemedText";

// Importamos los datos de ejercicios
import biceps from "@/mocks/exercises/biceps.json";
import espalda from "@/mocks/exercises/espalda.json";
import hombros from "@/mocks/exercises/hombros.json";
import pecho from "@/mocks/exercises/pecho.json";
import piernas from "@/mocks/exercises/piernas.json";
import triceps from "@/mocks/exercises/triceps.json";

interface MetricaConfigurable {
  metrica: string;
  unidad: string | null;
  tipo_input: string;
}

interface ValoresEjemplo {
  peso_kg?: number;
  repeticiones?: number;
  series?: number;
  duracion_minutos?: number;
  distancia_km?: number;
  descanso_entre_series_segundos?: number;
}

interface Exercise {
  id_ejercicio: string;
  nombre: string;
  descripcion: string;
  instrucciones: string[];
  tipo_ejercicio: string;
  modalidad: string;
  grupos_musculares: string[];
  equipamiento_necesario: string[];
  nivel_dificultad: string;
  media: {
    imagen_url: string;
    video_url: string;
  };
  metricas_configurables?: MetricaConfigurable[];
  valores_ejemplo_mujer_principiante: ValoresEjemplo;
  tags_busqueda: string[];
  advertencias: string;
  categoria?: string;
}

interface Category {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// Función para procesar los ejercicios y añadir categoría
const processExercises = (exercises: any[], categoria: string): Exercise[] => {
  return exercises.map((exercise) => ({
    ...exercise,
    categoria,
  }));
};

// Procesamos los ejercicios por categoría
const bicepsData = processExercises(biceps, "biceps");
const espaldaData = processExercises(espalda, "espalda");
const hombrosData = processExercises(hombros, "hombros");
const pechoData = processExercises(pecho, "pecho");
const piernasData = processExercises(piernas, "piernas");
const tricepsData = processExercises(triceps, "triceps");

// Función para obtener el color según la dificultad
const getDifficultyColor = (dificultad: string) => {
  switch (dificultad.toLowerCase()) {
    case "principiante":
      return "#4ade80"; // verde
    case "intermedio":
      return "#facc15"; // amarillo
    case "avanzado":
      return "#f87171"; // rojo
    default:
      return AiraColors.mutedForeground; // gris
  }
};

// Función para obtener el color según el tipo de ejercicio
const getTypeColor = (tipo: string) => {
  switch (tipo.toLowerCase()) {
    case "fuerza":
      return AiraColors.primary; // morado
    case "cardio":
      return "#60a5fa"; // azul
    case "flexibilidad":
      return "#34d399"; // verde
    default:
      return AiraColors.mutedForeground; // gris
  }
};

/**
 * Componente memoizado para renderizar cada tarjeta de ejercicio
 * Optimizado para evitar re-renderizados innecesarios
 */
const ExerciseItem = memo(
  ({
    exercise,
    onPress,
  }: {
    exercise: Exercise;
    onPress: (id: string) => void;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(exercise.id_ejercicio)}
        style={styles.exerciseCard}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.difficultyBadge,
              {
                backgroundColor:
                  getDifficultyColor(exercise.nivel_dificultad) + "20",
                borderColor: getDifficultyColor(exercise.nivel_dificultad),
              },
            ]}
          >
            <ThemedText
              type="small"
              style={[
                styles.difficultyText,
                { color: getDifficultyColor(exercise.nivel_dificultad) },
              ]}
            >
              {exercise.nivel_dificultad.charAt(0).toUpperCase() +
                exercise.nivel_dificultad.slice(1)}
            </ThemedText>
          </View>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor: getTypeColor(exercise.tipo_ejercicio) + "20",
                borderColor: getTypeColor(exercise.tipo_ejercicio),
              },
            ]}
          >
            <ThemedText
              type="small"
              style={[
                styles.typeText,
                { color: getTypeColor(exercise.tipo_ejercicio) },
              ]}
            >
              {exercise.tipo_ejercicio.charAt(0).toUpperCase() +
                exercise.tipo_ejercicio.slice(1)}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.exerciseTitle}>{exercise.nombre}</ThemedText>

        <ThemedText style={styles.exerciseCategory}>
          💪{" "}
          {exercise.categoria &&
            exercise.categoria.charAt(0).toUpperCase() +
              exercise.categoria.slice(1)}
        </ThemedText>

        <View style={styles.exerciseDetails}>
          <View style={styles.exerciseDetail}>
            <Ionicons
              name="barbell-outline"
              size={16}
              color={AiraColors.mutedForeground}
            />
            <ThemedText type="small" style={styles.exerciseDetailText}>
              {exercise.modalidad.charAt(0).toUpperCase() +
                exercise.modalidad.slice(1)}
            </ThemedText>
          </View>
          {exercise.valores_ejemplo_mujer_principiante?.repeticiones && (
            <View style={styles.exerciseDetail}>
              <Ionicons
                name="repeat-outline"
                size={16}
                color={AiraColors.mutedForeground}
              />
              <ThemedText type="small" style={styles.exerciseDetailText}>
                {exercise.valores_ejemplo_mujer_principiante.repeticiones} reps
              </ThemedText>
            </View>
          )}
          {exercise.valores_ejemplo_mujer_principiante?.duracion_minutos && (
            <View style={styles.exerciseDetail}>
              <Ionicons
                name="time-outline"
                size={16}
                color={AiraColors.mutedForeground}
              />
              <ThemedText type="small" style={styles.exerciseDetailText}>
                {exercise.valores_ejemplo_mujer_principiante.duracion_minutos}{" "}
                min
              </ThemedText>
            </View>
          )}
        </View>

        <ThemedText style={styles.exerciseDescription} numberOfLines={3}>
          {exercise.descripcion}
        </ThemedText>

        <View>
          <ThemedText type="small">Equipamiento:</ThemedText>
          <View style={styles.equipmentList}>
            {exercise.equipamiento_necesario.map((equipo, index) => (
              <View key={index} style={styles.equipmentItem}>
                <ThemedText type="small">{equipo.replace("_", " ")}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

// Añadir displayName para resolver error de lint
ExerciseItem.displayName = "ExerciseItem";

/**
 * Componente para mostrar cuando no hay resultados de búsqueda
 */
const EmptyResultsView = memo(() => (
  <View style={styles.emptyContainer}>
    <Ionicons
      name="search-outline"
      size={64}
      color={AiraColors.mutedForeground}
    />
    <ThemedText style={styles.emptyText}>
      No se encontraron ejercicios
    </ThemedText>
    <ThemedText style={styles.emptySubtext}>
      Intenta con otros filtros o términos de búsqueda
    </ThemedText>
  </View>
));

// Añadir displayName para resolver error de lint
EmptyResultsView.displayName = "EmptyResultsView";

interface ExercisesGalleryProps {
  selectedCategory?: string;
  setSelectedCategory: (category: string) => void;
}

const ExercisesGallery: React.FC<ExercisesGalleryProps> = ({
  selectedCategory = "biceps",
  setSelectedCategory,
}) => {
  const router = useRouter();

  const pagerRef = useRef<PagerView>(null);

  // Categorías de ejercicios memoizadas para evitar recreaciones en cada render
  const categories = useMemo<Category[]>(
    () => [
      { id: "biceps", label: "Biceps", icon: "fitness-outline" },
      { id: "espalda", label: "Espalda", icon: "body-outline" },
      { id: "hombros", label: "Hombros", icon: "barbell-outline" },
      { id: "pecho", label: "Pecho", icon: "expand-outline" },
      { id: "piernas", label: "Piernas", icon: "walk-outline" },
      { id: "triceps", label: "Triceps", icon: "fitness-outline" },
    ],
    []
  );

  const currentIndex = useMemo(
    () => categories.findIndex((cat) => cat.id === selectedCategory),
    [categories, selectedCategory]
  );

  // Utilizamos el hook personalizado para manejar el scroll de categorías
  const categoryScrollHook = useCategoryScroll(categories, currentIndex, {
    itemVisiblePercentThreshold: 70,
  });

  // Función para cambiar de categoría
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Obtener el índice de la categoría seleccionada
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (categoryIndex !== -1) {
      pagerRef.current?.setPage(categoryIndex);
    }
  };

  // Función para manejar el cambio de página en el PagerView
  const handlePageChange = (e: { nativeEvent: { position: number } }) => {
    const newIndex = e.nativeEvent.position;
    if (categories[newIndex]) {
      setSelectedCategory(categories[newIndex].id);
    }
  };

  // Manejar la navegación al detalle del ejercicio
  const handleExercisePress = useCallback(
    (exerciseId: string) => {
      // @ts-ignore - Ignoramos el error de tipado en la navegación
      router.push(`/exercise/${exerciseId}`);
    },
    [router]
  );

  // Renderizar cada item de la lista
  const renderExerciseItem = useCallback(
    ({ item }: { item: Exercise }) => {
      return <ExerciseItem exercise={item} onPress={handleExercisePress} />;
    },
    [handleExercisePress]
  );

  // Key extractor para la FlatList
  const keyExtractor = useCallback((item: Exercise) => item.id_ejercicio, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Selector de categorías */}
      <View style={styles.categoriesContainer}>
        <FlatList
          ref={categoryScrollHook.categoriesListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.categoryButtonActive,
              ]}
              onPress={() => handleCategoryChange(item.id)}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={AiraColors.foreground}
                style={styles.categoryIcon}
              />
              <ThemedText style={[styles.categoryText]}>
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesContent}
          onScrollToIndexFailed={categoryScrollHook.handleScrollToIndexFailed}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: 120, // Aproximado del ancho del botón de categoría + margen
            offset: 120 * index,
            index,
          })}
        />
      </View>

      {/* Contenido según la categoría seleccionada */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={currentIndex}
        onPageSelected={handlePageChange}
      >
        {/* Página 1: Biceps */}
        <View key="biceps" style={styles.pageContainer}>
          <FlatList
            data={bicepsData}
            renderItem={renderExerciseItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.exercisesContent}
            style={styles.exercisesContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            ListEmptyComponent={<EmptyResultsView />}
          />
        </View>

        {/* Página 2: Espalda */}
        <View key="espalda" style={styles.pageContainer}>
          <FlatList
            data={espaldaData}
            renderItem={renderExerciseItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.exercisesContent}
            style={styles.exercisesContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            ListEmptyComponent={<EmptyResultsView />}
          />
        </View>

        {/* Página 3: Hombros */}
        <View key="hombros" style={styles.pageContainer}>
          <FlatList
            data={hombrosData}
            renderItem={renderExerciseItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.exercisesContent}
            style={styles.exercisesContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            ListEmptyComponent={<EmptyResultsView />}
          />
        </View>

        {/* Página 4: Pecho */}
        <View key="pecho" style={styles.pageContainer}>
          <FlatList
            data={pechoData}
            renderItem={renderExerciseItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.exercisesContent}
            style={styles.exercisesContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            ListEmptyComponent={<EmptyResultsView />}
          />
        </View>

        {/* Página 5: Piernas */}
        <View key="piernas" style={styles.pageContainer}>
          <FlatList
            data={piernasData}
            renderItem={renderExerciseItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.exercisesContent}
            style={styles.exercisesContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            ListEmptyComponent={<EmptyResultsView />}
          />
        </View>

        {/* Página 6: Triceps */}
        <View key="triceps" style={styles.pageContainer}>
          <FlatList
            data={tricepsData}
            renderItem={renderExerciseItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.exercisesContent}
            style={styles.exercisesContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            ListEmptyComponent={<EmptyResultsView />}
          />
        </View>
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  // PagerView styles
  pagerView: {
    flex: 1,
    backgroundColor: AiraColors.card,
  },
  pageContainer: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Categories styles
  categoriesContainer: {
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  categoriesContent: {
    paddingHorizontal: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight: 12,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  categoryButtonActive: {
    borderColor: AiraColors.foreground,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: AiraColors.foreground,
  },

  // Exercise list styles
  exercisesContainer: {
    flex: 1,
  },
  exercisesContent: {
    padding: 8,
  },
  exerciseCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.foregroundWithOpacity(0.1),
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "500",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  exerciseMuscles: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: "row",
    marginBottom: 8,
  },
  exerciseDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  exerciseDetailText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginLeft: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
    marginBottom: 16,
  },

  equipmentTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  equipmentList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  equipmentItem: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
    marginRight: 8,
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  viewButton: {
    backgroundColor: AiraColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: AiraVariants.tagRadius,
    alignItems: "center",
  },
  viewButtonText: {
    color: AiraColors.background,
    fontSize: 14,
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginTop: 8,
    textAlign: "center",
  },
});

export default ExercisesGallery;
