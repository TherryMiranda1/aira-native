import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { View, StyleSheet, FlatList, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import PagerView from "react-native-pager-view";

import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { AiraColors } from "@/constants/Colors";
import { usePhrases } from "@/hooks/services/usePhrases";
import { phraseService, Phrase } from "@/services/api/phrase.service";
import { CategoriesList, Category } from "@/components/Categories";
import { useCategoryScroll } from "@/hooks/useCategoryScroll";
import { PhraseModal } from "@/components/modals/PhraseModal";
import { PhraseItem } from "@/features/quotes/PhraseItem";
import { EmptyState } from "@/components/States/EmptyState";
import { LoadingState } from "@/components/States/LoadingState";
import { ErrorState } from "@/components/States/ErrorState";
import { useToastHelpers } from "@/components/ui/ToastSystem";

const categoryLabels: Record<string, string> = {
  "Inicio-del-Dia-General": "Inicio del Día",
  "Momentos-de-Desanimo-Falta-de-Motivacion": "Motivación",
  "Despues-de-un-Esfuerzo-Pequenos-Logros": "Logros",
  "Recordatorios-de-Autocuidado-Compasion": "Autocuidado",
  "Cuando-se-Falla-un-Objetivo-Flexibilidad": "Flexibilidad",
  "Para-Empezar-Algo-Nuevo-Superar-la-Inercia": "Comienzos",
  "Manejo-del-Estres-Cansancio": "Estres",
  "Fomentar-la-Constancia": "Constancia",
  "Reflexion-al-Final-del-Dia": "Reflexión",
  "Conectando-con-el-Cuerpo-Ejercicio-Escucha": "Corporal",
  "Alimentacion-Consciente": "Alimentación",
  "Celebrando-la-Resiliencia": "Resiliencia",
};

const categoryColors: Record<string, string[]> = {
  "Inicio-del-Dia-General": ["#FB923C", "#F97316"],
  "Momentos-de-Desanimo-Falta-de-Motivacion": ["#60A5FA", "#3B82F6"],
  "Despues-de-un-Esfuerzo-Pequenos-Logros": ["#4ADE80", "#22C55E"],
  "Recordatorios-de-Autocuidado-Compasion": ["#F472B6", "#EC4899"],
  "Cuando-se-Falla-un-Objetivo-Flexibilidad": ["#A78BFA", "#8B5CF6"],
  "Para-Empezar-Algo-Nuevo-Superar-la-Inercia": ["#FBBF24", "#F59E0B"],
  "Manejo-del-Estres-Cansancio": ["#818CF8", "#6366F1"],
  "Fomentar-la-Constancia": ["#34D399", "#10B981"],
  "Reflexion-al-Final-del-Dia": ["#C084FC", "#A855F7"],
  "Conectando-con-el-Cuerpo-Ejercicio-Escucha": ["#22D3EE", "#06B6D4"],
  "Alimentacion-Consciente": ["#84CC16", "#65A30D"],
  "Celebrando-la-Resiliencia": ["#FB7185", "#F43F5E"],
};

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Inicio-del-Dia-General": "sunny-outline",
  "Momentos-de-Desanimo-Falta-de-Motivacion": "trending-up-outline",
  "Despues-de-un-Esfuerzo-Pequenos-Logros": "trophy-outline",
  "Recordatorios-de-Autocuidado-Compasion": "heart-outline",
  "Cuando-se-Falla-un-Objetivo-Flexibilidad": "refresh-outline",
  "Para-Empezar-Algo-Nuevo-Superar-la-Inercia": "rocket-outline",
  "Manejo-del-Estres-Cansancio": "leaf-outline",
  "Fomentar-la-Constancia": "checkmark-circle-outline",
  "Reflexion-al-Final-del-Dia": "moon-outline",
  "Conectando-con-el-Cuerpo-Ejercicio-Escucha": "body-outline",
  "Alimentacion-Consciente": "nutrition-outline",
  "Celebrando-la-Resiliencia": "shield-checkmark-outline",
};

interface PhrasesState {
  data: Phrase[];
  loading: boolean;
  error: string | null;
}

const initialPhrasesState: PhrasesState = {
  data: [],
  loading: false,
  error: null,
};

export default function FrasesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoria?: string }>();
  const pagerRef = useRef<PagerView>(null);
  const { showSuccessToast, showErrorToast } = useToastHelpers();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedPhrases, setLikedPhrases] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);
  const [modalPhraseIndex, setModalPhraseIndex] = useState(0);

  // Usar el hook de frases para obtener categorías disponibles
  const {
    categories: availableCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = usePhrases({
    filters: { activo: true, limit: 1 },
    autoFetch: true,
  });

  // Estado para cada categoría de frases
  const [phrasesState, setPhrasesState] = useState<
    Record<string, PhrasesState>
  >({});

  const getCategoryLabel = (categoria?: string) => {
    if (!categoria) return "";
    return categoryLabels[categoria] || categoria.replace(/-/g, " ");
  };

  const getCategoryColors = (categoria?: string) => {
    if (!categoria) return ["#60A5FA", "#3B82F6"];
    return categoryColors[categoria] || ["#60A5FA", "#3B82F6"];
  };

  const getCategoryIcon = (
    categoria?: string
  ): keyof typeof Ionicons.glyphMap => {
    if (!categoria) return "sparkles-outline";
    return (
      (categoryIcons[categoria] as keyof typeof Ionicons.glyphMap) ||
      "sparkles-outline"
    );
  };

  // Crear categorías con iconos y labels
  const categories: Category[] = useMemo(() => {
    return availableCategories.map((categoryId) => ({
      id: categoryId,
      label: getCategoryLabel(categoryId) || "",
      icon: getCategoryIcon(categoryId),
    }));
  }, [availableCategories]);

  // Determinar categoría inicial (desde parámetros o primera disponible)
  const initialCategory = useMemo(() => {
    if (params.categoria && availableCategories.includes(params.categoria)) {
      return params.categoria;
    }
    return availableCategories[0] || "";
  }, [params.categoria, availableCategories]);

  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);

  const currentIndex = useMemo(
    () => categories.findIndex((cat) => cat.id === selectedCategory),
    [selectedCategory, categories]
  );

  // Hook para scroll de categorías
  const categoryScrollHook = useCategoryScroll(categories, currentIndex, {
    itemVisiblePercentThreshold: 70,
  });

  // Función para cargar frases por categoría
  const fetchPhrasesByCategory = useCallback(
    async (category: string) => {
      const currentState = phrasesState[category];

      if (currentState?.data.length > 0 || currentState?.loading) {
        return;
      }

      try {
        setPhrasesState((prev) => ({
          ...prev,
          [category]: {
            data: [],
            loading: true,
            error: null,
          },
        }));

        const response = await phraseService.getPhrasesByCategory(category);

        setPhrasesState((prev) => ({
          ...prev,
          [category]: {
            data: response,
            loading: false,
            error: null,
          },
        }));
      } catch (error) {
        console.error(`Error fetching phrases for ${category}:`, error);
        setPhrasesState((prev) => ({
          ...prev,
          [category]: {
            data: [],
            loading: false,
            error: `Error al cargar las frases de ${getCategoryLabel(
              category
            )}`,
          },
        }));
      }
    },
    [phrasesState]
  );

  // Función para cambiar de categoría
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (categoryIndex !== -1) {
      pagerRef.current?.setPage(categoryIndex);
      fetchPhrasesByCategory(categoryId);
    }
  };

  // Función para manejar el cambio de página en el PagerView
  const handlePageChange = (e: { nativeEvent: { position: number } }) => {
    const newIndex = e.nativeEvent.position;
    if (categories[newIndex]) {
      setSelectedCategory(categories[newIndex].id);
      fetchPhrasesByCategory(categories[newIndex].id);
    }
  };

  // Funciones del modal
  const handlePhrasePress = (phrase: Phrase) => {
    const categoryState = phrasesState[selectedCategory];
    if (categoryState) {
      const phraseIndex = categoryState.data.findIndex(
        (p) => p.id === phrase.id
      );
      setSelectedPhrase(phrase);
      setModalPhraseIndex(phraseIndex);
      setModalVisible(true);
    }
  };

  const handleModalNext = () => {
    const categoryState = phrasesState[selectedCategory];
    if (categoryState && categoryState.data.length > 0) {
      const newIndex = (modalPhraseIndex + 1) % categoryState.data.length;
      setModalPhraseIndex(newIndex);
      setSelectedPhrase(categoryState.data[newIndex]);
    }
  };

  const handleModalPrevious = () => {
    const categoryState = phrasesState[selectedCategory];
    if (categoryState && categoryState.data.length > 0) {
      const newIndex =
        (modalPhraseIndex - 1 + categoryState.data.length) %
        categoryState.data.length;
      setModalPhraseIndex(newIndex);
      setSelectedPhrase(categoryState.data[newIndex]);
    }
  };

  const handleModalRandom = () => {
    const categoryState = phrasesState[selectedCategory];
    if (categoryState && categoryState.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * categoryState.data.length);
      setModalPhraseIndex(randomIndex);
      setSelectedPhrase(categoryState.data[randomIndex]);
    }
  };

  const handleCopyPhrase = async (phrase: string, id: string) => {
    try {
      console.log("Nueva frase copiada", phrase);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      showSuccessToast(
        "Frase copiada",
        "La frase ha sido copiada al portapapeles 💕"
      );
    } catch (error) {
      showErrorToast("Error", "No se pudo copiar la frase");
    }
  };

  const handleLikePhrase = async (id: string) => {
    try {
      await phraseService.incrementPopularity(id);
      const newLikedPhrases = new Set(likedPhrases);
      if (newLikedPhrases.has(id)) {
        newLikedPhrases.delete(id);
      } else {
        newLikedPhrases.add(id);
      }
      setLikedPhrases(newLikedPhrases);
      showSuccessToast("¡Gracias!", "Tu corazón ha sido registrado 💖");
    } catch (error) {
      console.error("Error liking phrase:", error);
      showErrorToast("Error", "No se pudo registrar tu like");
    }
  };

  const handleSharePhrase = async (phrase: string) => {
    try {
      await Share.share({
        message: `"${phrase}" - Compartido desde Aira 💜`,
      });
    } catch (error) {
      console.error("Error sharing phrase:", error);
    }
  };

  // Renderizar cada item de la lista
  const renderPhraseItem = useCallback(
    ({ item }: { item: Phrase }) => {
      return (
        <PhraseItem
          phrase={item}
          categoryColors={getCategoryColors(selectedCategory)}
          categoryLabel={getCategoryLabel(selectedCategory) || ""}
          onPress={handlePhrasePress}
        />
      );
    },
    [selectedCategory, handlePhrasePress]
  );

  // Key extractor para la FlatList
  const keyExtractor = useCallback(
    (item: Phrase) => item.id || Math.random().toString(),
    []
  );

  // Efectos
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      fetchPhrasesByCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (selectedCategory && pagerRef.current) {
      const categoryIndex = categories.findIndex(
        (cat) => cat.id === selectedCategory
      );
      if (categoryIndex !== -1) {
        pagerRef.current?.setPage(categoryIndex);
      }
    }
  }, [selectedCategory, categories]);

  // Loading State inicial
  if (categoriesLoading) {
    return (
      <PageView>
        <Topbar
          title="Frases Inspiradoras"
          actions={<ProfileButton />}
          showBackButton={true}
        />
        <LoadingState />
      </PageView>
    );
  }

  // Error State inicial
  if (categoriesError) {
    return (
      <PageView>
        <Topbar
          title="Frases Inspiradoras"
          actions={<ProfileButton />}
          showBackButton={true}
        />
        <ErrorState
          title="Error al cargar categorías"
          onRetry={() => router.back()}
        />
      </PageView>
    );
  }
  return (
    <PageView>
      <Topbar
        title="Frases Inspiradoras"
        actions={<ProfileButton />}
        showBackButton={true}
      />

      <View style={styles.container}>
        {/* Categories Navigation */}
        {categories.length > 0 && (
          <CategoriesList
            categories={categories}
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
            categoryScrollHook={categoryScrollHook}
          />
        )}

        {/* PagerView Content */}
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={currentIndex}
          onPageSelected={handlePageChange}
        >
          {categories.map((category) => {
            const categoryState =
              phrasesState[category.id] || initialPhrasesState;

            return (
              <View key={category.id} style={styles.pageContainer}>
                {categoryState.loading ? (
                  <LoadingState />
                ) : categoryState.error ? (
                  <ErrorState
                    title="Error al cargar las frases"
                    onRetry={() => fetchPhrasesByCategory(category.id)}
                  />
                ) : (
                  <FlatList
                    data={categoryState.data}
                    renderItem={renderPhraseItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.phrasesContent}
                    style={styles.phrasesContainer}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews={true}
                    ListEmptyComponent={
                      <EmptyState
                        title="No hay frases disponibles"
                        description={`No se encontraron frases para ${getCategoryLabel(
                          category.id
                        )}.`}
                      />
                    }
                  />
                )}
              </View>
            );
          })}
        </PagerView>

        {/* Phrase Modal */}
        <PhraseModal
          visible={modalVisible}
          phrase={selectedPhrase}
          categoryColors={getCategoryColors(selectedCategory)}
          categoryLabel={getCategoryLabel(selectedCategory) || ""}
          currentIndex={modalPhraseIndex}
          totalCount={phrasesState[selectedCategory]?.data.length || 0}
          copiedId={copiedId}
          isLiked={selectedPhrase ? likedPhrases.has(selectedPhrase.id) : false}
          onClose={() => setModalVisible(false)}
          onNext={handleModalNext}
          onPrevious={handleModalPrevious}
          onRandom={handleModalRandom}
          onCopy={handleCopyPhrase}
          onLike={handleLikePhrase}
          onShare={handleSharePhrase}
        />
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  phrasesContainer: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  phrasesContent: {
    padding: 16,
  },
});

