import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";

export interface EventIcon {
  id: string;
  emoji: string;
  label: string;
  category: string;
}

export const eventIcons: EventIcon[] = [
  // Salud y Bienestar
  { id: "health-1", emoji: "🌿", label: "Bienestar", category: "health" },
  { id: "health-2", emoji: "💚", label: "Salud", category: "health" },
  { id: "health-3", emoji: "🧘‍♀️", label: "Meditación", category: "health" },
  { id: "health-4", emoji: "🌱", label: "Crecimiento", category: "health" },
  { id: "health-5", emoji: "✨", label: "Energía", category: "health" },
  
  // Ejercicio
  { id: "exercise-1", emoji: "💪", label: "Fuerza", category: "exercise" },
  { id: "exercise-2", emoji: "🏃‍♀️", label: "Cardio", category: "exercise" },
  { id: "exercise-3", emoji: "🧘", label: "Yoga", category: "exercise" },
  { id: "exercise-4", emoji: "🚴‍♀️", label: "Ciclismo", category: "exercise" },
  { id: "exercise-5", emoji: "🏋️‍♀️", label: "Pesas", category: "exercise" },
  { id: "exercise-6", emoji: "🤸‍♀️", label: "Flexibilidad", category: "exercise" },
  
  // Alimentación
  { id: "nutrition-1", emoji: "🥗", label: "Ensalada", category: "nutrition" },
  { id: "nutrition-2", emoji: "🍎", label: "Fruta", category: "nutrition" },
  { id: "nutrition-3", emoji: "🥑", label: "Saludable", category: "nutrition" },
  { id: "nutrition-4", emoji: "🍲", label: "Comida", category: "nutrition" },
  { id: "nutrition-5", emoji: "💧", label: "Hidratación", category: "nutrition" },
  { id: "nutrition-6", emoji: "☕", label: "Bebida", category: "nutrition" },
  
  // Autocuidado
  { id: "selfcare-1", emoji: "💆‍♀️", label: "Relajación", category: "selfcare" },
  { id: "selfcare-2", emoji: "🛁", label: "Baño", category: "selfcare" },
  { id: "selfcare-3", emoji: "💅", label: "Cuidado", category: "selfcare" },
  { id: "selfcare-4", emoji: "🌸", label: "Belleza", category: "selfcare" },
  { id: "selfcare-5", emoji: "🕯️", label: "Calma", category: "selfcare" },
  { id: "selfcare-6", emoji: "📖", label: "Lectura", category: "selfcare" },
  
  // Personal
  { id: "personal-1", emoji: "📝", label: "Tarea", category: "personal" },
  { id: "personal-2", emoji: "🎯", label: "Meta", category: "personal" },
  { id: "personal-3", emoji: "💭", label: "Reflexión", category: "personal" },
  { id: "personal-4", emoji: "🎨", label: "Creatividad", category: "personal" },
  { id: "personal-5", emoji: "📚", label: "Estudio", category: "personal" },
  { id: "personal-6", emoji: "🌟", label: "Inspiración", category: "personal" },
  
  // Trabajo
  { id: "work-1", emoji: "💼", label: "Reunión", category: "work" },
  { id: "work-2", emoji: "💻", label: "Trabajo", category: "work" },
  { id: "work-3", emoji: "📊", label: "Análisis", category: "work" },
  { id: "work-4", emoji: "📞", label: "Llamada", category: "work" },
  { id: "work-5", emoji: "✅", label: "Completar", category: "work" },
  { id: "work-6", emoji: "⏰", label: "Deadline", category: "work" },
  
  // Médico
  { id: "medical-1", emoji: "🏥", label: "Hospital", category: "medical" },
  { id: "medical-2", emoji: "👩‍⚕️", label: "Doctor", category: "medical" },
  { id: "medical-3", emoji: "💊", label: "Medicina", category: "medical" },
  { id: "medical-4", emoji: "🩺", label: "Consulta", category: "medical" },
  { id: "medical-5", emoji: "💉", label: "Vacuna", category: "medical" },
  { id: "medical-6", emoji: "🦷", label: "Dental", category: "medical" },
  
  // Otros
  { id: "other-1", emoji: "🎉", label: "Celebración", category: "other" },
  { id: "other-2", emoji: "🎁", label: "Regalo", category: "other" },
  { id: "other-3", emoji: "🌍", label: "Viaje", category: "other" },
  { id: "other-4", emoji: "👥", label: "Social", category: "other" },
  { id: "other-5", emoji: "🎵", label: "Música", category: "other" },
  { id: "other-6", emoji: "📱", label: "Digital", category: "other" },
];

interface IconSelectorProps {
  selectedIcon?: string;
  onSelectIcon: (iconId: string) => void;
  categoryFilter?: string;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  onSelectIcon,
  categoryFilter,
}) => {
  const filteredIcons = categoryFilter
    ? eventIcons.filter((icon) => icon.category === categoryFilter)
    : eventIcons;

  const categories = Array.from(
    new Set(eventIcons.map((icon) => icon.category))
  );

  const getIconsByCategory = (category: string) =>
    eventIcons.filter((icon) => icon.category === category);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {categoryFilter ? (
          <View style={styles.iconsGrid}>
            {filteredIcons.map((icon) => (
              <TouchableOpacity
                key={icon.id}
                style={[
                  styles.iconButton,
                  selectedIcon === icon.id && styles.iconButtonSelected,
                ]}
                onPress={() => onSelectIcon(icon.id)}
              >
                <ThemedText style={styles.iconEmoji}>{icon.emoji}</ThemedText>
                <ThemedText style={styles.iconLabel} numberOfLines={1}>
                  {icon.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          categories.map((category) => (
            <View key={category} style={styles.categorySection}>
              <ThemedText style={styles.categoryTitle}>
                {getCategoryLabel(category)}
              </ThemedText>
              <View style={styles.iconsGrid}>
                {getIconsByCategory(category).map((icon) => (
                  <TouchableOpacity
                    key={icon.id}
                    style={[
                      styles.iconButton,
                      selectedIcon === icon.id && styles.iconButtonSelected,
                    ]}
                    onPress={() => onSelectIcon(icon.id)}
                  >
                    <ThemedText style={styles.iconEmoji}>
                      {icon.emoji}
                    </ThemedText>
                    <ThemedText style={styles.iconLabel} numberOfLines={1}>
                      {icon.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    health: "Salud y Bienestar",
    exercise: "Ejercicio",
    nutrition: "Alimentación",
    selfcare: "Autocuidado",
    personal: "Personal",
    work: "Trabajo",
    medical: "Médico",
    other: "Otros",
  };
  return labels[category] || category;
};

export const getIconById = (iconId: string): EventIcon | undefined => {
  return eventIcons.find((icon) => icon.id === iconId);
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
  },
  scrollView: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
     
    color: AiraColors.foreground,
    marginBottom: 12,
  },
  iconsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  iconButton: {
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    minWidth: 70,
    flex: 1,
    maxWidth: "30%",
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
  },
  iconButtonSelected: {
    backgroundColor: AiraColors.primary + "20",
    borderColor: AiraColors.primary,
  },
  iconEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  iconLabel: {
    fontSize: 12,
    color: AiraColors.foreground,
    textAlign: "center",
  },
}); 