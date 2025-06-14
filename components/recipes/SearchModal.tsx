import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
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
              Buscar Recetas
            </ThemedText>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={AiraColors.mutedForeground}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholderTextColor={AiraColors.mutedForeground}
              placeholder="Buscar recetas o ingredientes..."
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
                Busca por nombre de receta o ingrediente principal
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={AiraColors.mutedForeground}
              />
              <ThemedText style={styles.tipText}>
                Ejemplos: &ldquo;pollo&rdquo;, &ldquo;ensalada&rdquo;,
                &ldquo;desayuno&rdquo;, &ldquo;postre&rdquo;
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
    flex: 1,
    backgroundColor: AiraColors.background,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 46,
    color: AiraColors.foreground,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  recentSearchesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,

    color: AiraColors.foreground,
    marginBottom: 12,
  },
  recentSearchesList: {
    maxHeight: 120,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  recentSearchText: {
    marginLeft: 8,
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  searchTipsContainer: {
    marginBottom: 24,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  tipText: {
    marginLeft: 8,
    fontSize: 14,
    color: AiraColors.mutedForeground,
    flex: 1,
    lineHeight: 20,
  },
  searchButton: {
    backgroundColor: AiraColors.primary,
    borderRadius: AiraVariants.cardRadius,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: "auto",
  },
  searchButtonText: {
    color: AiraColors.foreground,
    fontSize: 16,
  },
});
