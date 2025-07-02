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
import { ThemedInput } from "../ThemedInput";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

interface SearchModalProps {
  visible: boolean;
  searchTerm: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onSearch: () => void;
  recentSearches?: string[];
  onSelectRecentSearch?: (search: string) => void;
}

export function SearchModal({
  visible,
  searchTerm,
  onChangeText,
  onClose,
  onSearch,
  recentSearches = [],
  onSelectRecentSearch,
}: SearchModalProps) {
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
              Buscar Ejercicios
            </ThemedText>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={AiraColors.mutedForeground}
              style={styles.searchIcon}
            />
            <ThemedInput
              variant="search"
              placeholder="Buscar ejercicios, músculos o etiquetas..."
              value={searchTerm}
              onChangeText={onChangeText}
              autoFocus={true}
              returnKeyType="search"
              onSubmitEditing={onSearch}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity
                onPress={() => onChangeText("")}
                style={styles.clearButton}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={AiraColors.mutedForeground}
                />
              </TouchableOpacity>
            )}
          </View>

          {recentSearches.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <ThemedText style={styles.sectionTitle}>
                Búsquedas recientes
              </ThemedText>
              <ScrollView style={styles.recentSearchesList}>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentSearchItem}
                    onPress={() =>
                      onSelectRecentSearch && onSelectRecentSearch(search)
                    }
                  >
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText style={styles.recentSearchText}>
                      {search}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.searchTipsContainer}>
            <ThemedText style={styles.sectionTitle}>
              Consejos de búsqueda
            </ThemedText>
            <View style={styles.tipItem}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={AiraColors.mutedForeground}
              />
              <ThemedText style={styles.tipText}>
                Busca por nombre de ejercicio, grupo muscular o etiqueta
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={AiraColors.mutedForeground}
              />
              <ThemedText style={styles.tipText}>
                Ejemplos: &ldquo;bíceps&rdquo;, &ldquo;pecho&rdquo;,
                &ldquo;principiante&rdquo;, &ldquo;sin equipo&rdquo;
              </ThemedText>
            </View>
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
            <ThemedText style={styles.searchButtonText}>Listo! </ThemedText>
          </TouchableOpacity>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    borderRadius: AiraVariants.tagRadius,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },

  clearButton: {
    padding: 4,
  },
  recentSearchesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  recentSearchesList: {
    maxHeight: 200,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  recentSearchText: {
    marginLeft: 12,
    fontSize: 14,
  },
  searchTipsContainer: {
    marginBottom: 24,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipText: {
    marginLeft: 8,
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  searchButton: {
    backgroundColor: AiraColors.primary,
    paddingVertical: 14,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
  },
  searchButtonText: {
    color: AiraColors.foreground,
    fontSize: 16,
  },
});
