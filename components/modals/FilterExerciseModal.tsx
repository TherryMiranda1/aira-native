import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  
  // Difficulty filters
  filterDifficulty: string;
  setFilterDifficulty: (difficulty: string) => void;
  
  // Type filters
  filterType: string;
  setFilterType: (type: string) => void;
  
  // Category filters
  filterCategory: string;
  setFilterCategory: (category: string) => void;
}

const difficultyOptions: FilterOption[] = [
  { id: "", label: "Todas las dificultades" },
  { id: "principiante", label: "Principiante" },
  { id: "intermedio", label: "Intermedio" },
  { id: "avanzado", label: "Avanzado" },
];

const typeOptions: FilterOption[] = [
  { id: "", label: "Todos los tipos" },
  { id: "fuerza", label: "Fuerza" },
  { id: "cardio", label: "Cardio" },
  { id: "flexibilidad", label: "Flexibilidad" },
];

const categoryOptions: FilterOption[] = [
  { id: "", label: "Todas las categorías" },
  { id: "biceps", label: "Bíceps" },
  { id: "espalda", label: "Espalda" },
  { id: "hombros", label: "Hombros" },
  { id: "pecho", label: "Pecho" },
  { id: "piernas", label: "Piernas" },
  { id: "triceps", label: "Tríceps" },
];

export function FilterModal({
  visible,
  onClose,
  onApplyFilters,
  onResetFilters,
  filterDifficulty,
  setFilterDifficulty,
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
}: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={AiraColors.foreground} />
            </TouchableOpacity>
            <ThemedText style={styles.title} type="title">
              Filtrar Ejercicios
            </ThemedText>
          </View>

          <ScrollView style={styles.filtersScrollView}>
            {/* Difficulty Filter Section */}
            <View style={styles.filterSection}>
              <ThemedText style={styles.sectionTitle}>
                Nivel de dificultad
              </ThemedText>
              <View style={styles.optionsContainer}>
                {difficultyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.filterOption,
                      filterDifficulty === option.id && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilterDifficulty(option.id)}
                  >
                    <ThemedText
                      style={[
                        styles.filterOptionText,
                        filterDifficulty === option.id && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Type Filter Section */}
            <View style={styles.filterSection}>
              <ThemedText style={styles.sectionTitle}>
                Tipo de ejercicio
              </ThemedText>
              <View style={styles.optionsContainer}>
                {typeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.filterOption,
                      filterType === option.id && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilterType(option.id)}
                  >
                    <ThemedText
                      style={[
                        styles.filterOptionText,
                        filterType === option.id && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Filter Section */}
            <View style={styles.filterSection}>
              <ThemedText style={styles.sectionTitle}>
                Categoría muscular
              </ThemedText>
              <View style={styles.optionsContainer}>
                {categoryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.filterOption,
                      filterCategory === option.id && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilterCategory(option.id)}
                  >
                    <ThemedText
                      style={[
                        styles.filterOptionText,
                        filterCategory === option.id && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={onResetFilters}
            >
              <ThemedText style={styles.resetButtonText}>
                Restablecer
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={onApplyFilters}
            >
              <ThemedText style={styles.applyButtonText}>
                Aplicar filtros
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: AiraColors.background,
    height: "100%",
    borderTopLeftRadius: AiraVariants.cardRadius,
    borderTopRightRadius: AiraVariants.cardRadius,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
  },
  filtersScrollView: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    borderRadius: AiraVariants.tagRadius,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  filterOptionActive: {
    backgroundColor: AiraColors.primary,
    borderColor: AiraColors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  filterOptionTextActive: {
    color: AiraColors.foreground,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    marginRight: 8,
  },
  resetButtonText: {
    color: AiraColors.mutedForeground,
    fontSize: 16,
  },
  applyButton: {
    flex: 2,
    backgroundColor: AiraColors.primary,
    paddingVertical: 14,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
  },
  applyButtonText: {
    color: AiraColors.foreground,
    fontSize: 16,
  },
});
