import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { ScrollToIndexFailedInfo } from "@/hooks/useCategoryScroll";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemePreference } from "@/context/ThemePreferenceContext";
import { useThemeColor } from "@/hooks/useThemeColor";

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
  const foreground = useThemeColor({}, "foreground");
  const muted = useThemeColor({}, "muted");
  return (
    <ThemedView style={styles.categoriesContainer}>
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
              {
                borderColor:
                  selectedCategory === item.id ? foreground : "transparent",
              },
            ]}
            onPress={() => handleCategoryChange(item.id)}
          >
            <Ionicons
              name={item.icon}
              size={18}
              style={styles.categoryIcon}
              color={foreground}
            />
            <ThemedText
              type={
                selectedCategory === item.id ? "defaultSemiBold" : "default"
              }
              style={[styles.categoryText]}
            >
              {item.label}
            </ThemedText>
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
    </ThemedView>
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

  categoryIcon: {
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
  },
});
