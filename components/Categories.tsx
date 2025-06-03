import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { ScrollToIndexFailedInfo } from "@/hooks/useCategoryScroll";
import { ThemedText } from "@/components/ThemedText";

export interface Category {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface Props {
  categories: Category[];
  selectedCategory: string;
  handleCategoryChange: (id: string) => void;
  categoryScrollHook: {
    categoriesListRef: React.RefObject<FlatList<Category> | null>;
    handleScrollToIndexFailed: (info: ScrollToIndexFailedInfo) => void;
  };
}

export const CategoriesList = ({
  categories,
  selectedCategory,
  handleCategoryChange,
  categoryScrollHook,
}: Props) => {
  return (
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
            <ThemedText style={[styles.categoryText]}>{item.label}</ThemedText>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoriesContent}
        onScrollToIndexFailed={categoryScrollHook.handleScrollToIndexFailed}
        getItemLayout={(data, index) => ({
          length: 120, // Aproximado del ancho del botón de categoría + margen
          offset: 120 * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  categoryTextActive: {
    color: AiraColors.background,
  },
});
