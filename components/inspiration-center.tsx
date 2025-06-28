import React, { useState, useRef, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCategoryScroll } from "@/hooks/useCategoryScroll";
import PagerView from "react-native-pager-view";

import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { ThemedText } from "@/components/ThemedText";
import { PageView } from "@/components/ui/PageView";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { Topbar } from "@/components/ui/Topbar";

interface Quote {
  text: string;
  author: string;
}

interface Challenge {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  duration: string;
}

interface Ritual {
  title: string;
  steps: string[];
  time: string;
  mood: string;
}

interface Category {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function InspirationCenterScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>("frases");
  const [currentQuote, setCurrentQuote] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  // No necesitamos mantener un estado separado para la página actual
  // ya que podemos derivarlo del selectedCategory

  // Categorías
  const categories: Category[] = useMemo(
    () => [
      { id: "frases", label: "Inspiración", icon: "heart-outline" },
      { id: "retos", label: "Mini Retos", icon: "star-outline" },
      { id: "rituales", label: "Rituales", icon: "sparkles-outline" },
    ],
    []
  );

  const currentIndex = useMemo(
    () => categories.findIndex((cat) => cat.id === selectedCategory),
    [selectedCategory, categories]
  );

  // Utilizamos el hook personalizado para manejar el scroll de categorías
  const categoryScrollHook = useCategoryScroll(categories, currentIndex, {
    itemVisiblePercentThreshold: 70,
  });

  // Frases inspiradoras
  const inspirationalQuotes: Quote[] = [
    {
      text: "Eres más valiente de lo que crees, más fuerte de lo que pareces y más querida de lo que imaginas.",
      author: "Aira 💜",
    },
    {
      text: "El cuidado personal no es egoísmo. Es amor propio en acción.",
      author: "Tu compañera Aira",
    },
    {
      text: "Cada día que eliges cuidarte, el mundo se vuelve un poco más hermoso.",
      author: "Aira ✨",
    },
    {
      text: "No tienes que ser perfecta para ser digna de amor y cuidado.",
      author: "Con cariño, Aira",
    },
  ];

  // Mini retos
  const miniChallenges: Challenge[] = [
    {
      icon: "sunny-outline",
      title: "Saludo al día",
      description:
        "Al despertar, respira profundo 3 veces y agradece algo pequeño",
      duration: "2 minutos",
    },
    {
      icon: "heart-outline",
      title: "Caricia emocional",
      description:
        "Ponte la mano en el corazón y repite: 'Estoy haciendo lo mejor que puedo'",
      duration: "1 minuto",
    },
    {
      icon: "flower-outline",
      title: "Momento de belleza",
      description: "Observa algo hermoso a tu alrededor y respira su esencia",
      duration: "3 minutos",
    },
    {
      icon: "moon-outline",
      title: "Ritual de cierre",
      description: "Antes de dormir, reconoce una cosa buena que hiciste hoy",
      duration: "2 minutos",
    },
  ];

  // Rituales
  const rituals: Ritual[] = [
    {
      title: "Ritual del té consciente",
      steps: [
        "Prepara tu té favorito con intención",
        "Sostén la taza y siente su calor",
        "Inhala el aroma antes de beber",
        "Bebe despacio, saboreando cada sorbo",
        "Agradece este momento para ti",
      ],
      time: "10 minutos",
      mood: "Para momentos de calma",
    },
    {
      title: "Abrazo de autocuidado",
      steps: [
        "Cruza los brazos sobre tu pecho",
        "Abrázate suavemente",
        "Respira profundo 5 veces",
        "Repite: 'Me amo y me cuido'",
        "Sonríe suavemente",
      ],
      time: "3 minutos",
      mood: "Cuando necesites consuelo",
    },
    {
      title: "Danza libre de 5 minutos",
      steps: [
        "Pon tu canción favorita",
        "Cierra los ojos si te apetece",
        "Mueve tu cuerpo como se sienta bien",
        "No hay forma correcta o incorrecta",
        "Disfruta ser tú misma",
      ],
      time: "5 minutos",
      mood: "Para liberar energía",
    },
  ];

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

  // Función para avanzar a la siguiente frase
  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length);
  };

  return (
    <PageView>
      {/* Topbar */}
      <Topbar title="Inspiración ✨" actions={<ProfileButton />} />

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
                color={
                  selectedCategory === item.id
                    ? AiraColors.background
                    : AiraColors.foreground
                }
                style={styles.categoryIcon}
              />
              <ThemedText
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.categoryTextActive,
                ]}
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
      </View>

      {/* Contenido según la categoría seleccionada */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageChange}
      >
        {/* Página 1: Frases Inspiradoras */}
        <View key="frases" style={styles.pageContainer}>
          <ScrollView
            style={styles.contentContainer}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.quotesContainer}>
              <View style={styles.quoteCard}>
                <View style={styles.quoteIconContainer}>
                  <Ionicons
                    name="heart"
                    size={28}
                    color={AiraColors.primary}
                    style={styles.pulseIcon}
                  />
                </View>
                <ThemedText style={styles.quoteText}>
                  &ldquo;{inspirationalQuotes[currentQuote].text}&rdquo;
                </ThemedText>
                <ThemedText style={styles.quoteAuthor}>
                  — {inspirationalQuotes[currentQuote].author}
                </ThemedText>
                <TouchableOpacity
                  style={styles.nextQuoteButton}
                  onPress={nextQuote}
                >
                  <Ionicons
                    name="sparkles-outline"
                    size={16}
                    color={AiraColors.background}
                    style={styles.nextQuoteIcon}
                  />
                  <ThemedText style={styles.nextQuoteText}>
                    Otra frase
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recordatorio suave */}
            <View style={styles.reminderCard}>
              <ThemedText style={styles.reminderText}>
                🌸 La inspiración no tiene que ser perfecta para ser poderosa.
                {"\n"}
                Elige lo que resuene contigo hoy.
              </ThemedText>
            </View>
          </ScrollView>
        </View>

        {/* Página 2: Mini Retos */}
        <View key="retos" style={styles.pageContainer}>
          <ScrollView
            style={styles.contentContainer}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.challengesContainer}>
              {miniChallenges.map((challenge, index) => (
                <View key={index} style={styles.challengeCard}>
                  <View style={styles.challengeHeader}>
                    <View style={styles.challengeIconContainer}>
                      <Ionicons
                        name={challenge.icon}
                        size={20}
                        color={AiraColors.primary}
                      />
                    </View>
                    <View style={styles.challengeTitleContainer}>
                      <ThemedText style={styles.challengeTitle}>
                        {challenge.title}
                      </ThemedText>
                      <View style={styles.durationBadge}>
                        <ThemedText style={styles.durationText}>
                          {challenge.duration}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  <ThemedText style={styles.challengeDescription}>
                    {challenge.description}
                  </ThemedText>
                  <TouchableOpacity style={styles.tryButton}>
                    <ThemedText style={styles.tryButtonText}>
                      ¡Me apetece probarlo! ✨
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Recordatorio suave */}
            <View style={styles.reminderCard}>
              <ThemedText style={styles.reminderText}>
                🌸 La inspiración no tiene que ser perfecta para ser poderosa.
                {"\n"}
                Elige lo que resuene contigo hoy.
              </ThemedText>
            </View>
          </ScrollView>
        </View>

        {/* Página 3: Rituales */}
        <View key="rituales" style={styles.pageContainer}>
          <ScrollView
            style={styles.contentContainer}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.ritualsContainer}>
              {rituals.map((ritual, index) => (
                <View key={index} style={styles.ritualCard}>
                  <View style={styles.ritualHeader}>
                    <ThemedText style={styles.ritualTitle}>
                      {ritual.title}
                    </ThemedText>
                    <View style={styles.timeBadge}>
                      <ThemedText style={styles.timeText}>
                        {ritual.time}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.moodText}>{ritual.mood}</ThemedText>

                  <View style={styles.stepsContainer}>
                    {ritual.steps.map((step, stepIndex) => (
                      <View key={stepIndex} style={styles.stepItem}>
                        <View style={styles.stepNumber}>
                          <ThemedText style={styles.stepNumberText}>
                            {stepIndex + 1}
                          </ThemedText>
                        </View>
                        <ThemedText style={styles.stepText}>{step}</ThemedText>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.startRitualButton}>
                    <Ionicons
                      name="heart-outline"
                      size={16}
                      color={AiraColors.background}
                      style={styles.startRitualIcon}
                    />
                    <ThemedText style={styles.startRitualText}>
                      Comenzar ritual
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Recordatorio suave */}
            <View style={styles.reminderCard}>
              <ThemedText style={styles.reminderText}>
                🌸 La inspiración no tiene que ser perfecta para ser poderosa.
                {"\n"}
                Elige lo que resuene contigo hoy.
              </ThemedText>
            </View>
          </ScrollView>
        </View>
      </PagerView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  // PagerView styles
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  // Topbar styles
  topbarContainer: {
    backgroundColor: AiraColors.background,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  topbarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  topbarTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  // Categories styles
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    borderRadius: AiraVariants.tagRadius,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  categoryButtonActive: {
    backgroundColor: AiraColors.primary,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.2),
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
  // Content container
  contentContainer: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
  },
  // Quotes styles
  quotesContainer: {
    marginBottom: 16,
  },
  quoteCard: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  quoteIconContainer: {
    marginBottom: 16,
  },
  pulseIcon: {
    opacity: 0.9,
  },
  quoteText: {
    fontSize: 18,
     
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 16,
    color: AiraColors.foreground,
  },
  quoteAuthor: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 20,
  },
  nextQuoteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: AiraVariants.tagRadius,
  },
  nextQuoteIcon: {
    marginRight: 8,
  },
  nextQuoteText: {
    color: AiraColors.background,
     
  },
  // Challenges styles
  challengesContainer: {
    marginBottom: 16,
  },
  challengeCard: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  challengeHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  challengeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  challengeTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  durationBadge: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
  },
  durationText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  challengeDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
    marginBottom: 16,
  },
  tryButton: {
    backgroundColor: AiraColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: AiraVariants.tagRadius,
    alignSelf: "center",
  },
  tryButtonText: {
    color: AiraColors.background,
    fontSize: 14,
     
  },
  // Rituals styles
  ritualsContainer: {
    marginBottom: 16,
  },
  ritualCard: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  ritualHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ritualTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  timeBadge: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
  },
  timeText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  moodText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    fontStyle: "italic",
    marginBottom: 16,
  },
  stepsContainer: {
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 10,
    color: AiraColors.primary,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
  },
  startRitualButton: {
    backgroundColor: AiraColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: AiraVariants.tagRadius,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  startRitualIcon: {
    marginRight: 8,
  },
  startRitualText: {
    color: AiraColors.background,
    fontSize: 14,
     
  },
  // Reminder card
  reminderCard: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  reminderText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 20,
  },
});
