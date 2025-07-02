import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, FlatList, Share } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { AiraColors } from "@/constants/Colors";
import { phraseService, Phrase } from "@/services/api/phrase.service";
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

export default function FraseCategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showSuccessToast, showErrorToast } = useToastHelpers();

  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedPhrases, setLikedPhrases] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);
  const [modalPhraseIndex, setModalPhraseIndex] = useState(0);

  const categoryId = id as string;
  const categoryLabel =
    categoryLabels[categoryId] || categoryId?.replace(/-/g, " ") || "Frases";
  const categoryColorPair = categoryColors[categoryId] || [
    "#60A5FA",
    "#3B82F6",
  ];

  const fetchPhrases = useCallback(async () => {
    if (!categoryId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await phraseService.getPhrasesByCategory(categoryId);
      setPhrases(response);
    } catch (err) {
      console.error(`Error fetching phrases for ${categoryId}:`, err);
      setError(`Error al cargar las frases de ${categoryLabel}`);
    } finally {
      setLoading(false);
    }
  }, [categoryId, categoryLabel]);

  const handlePhrasePress = (phrase: Phrase) => {
    const phraseIndex = phrases.findIndex((p) => p.id === phrase.id);
    setSelectedPhrase(phrase);
    setModalPhraseIndex(phraseIndex);
    setModalVisible(true);
  };

  const handleModalNext = () => {
    if (phrases.length > 0) {
      const newIndex = (modalPhraseIndex + 1) % phrases.length;
      setModalPhraseIndex(newIndex);
      setSelectedPhrase(phrases[newIndex]);
    }
  };

  const handleModalPrevious = () => {
    if (phrases.length > 0) {
      const newIndex = (modalPhraseIndex - 1 + phrases.length) % phrases.length;
      setModalPhraseIndex(newIndex);
      setSelectedPhrase(phrases[newIndex]);
    }
  };

  const handleModalRandom = () => {
    if (phrases.length > 0) {
      const randomIndex = Math.floor(Math.random() * phrases.length);
      setModalPhraseIndex(randomIndex);
      setSelectedPhrase(phrases[randomIndex]);
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

  const renderPhraseItem = useCallback(
    ({ item }: { item: Phrase }) => {
      return (
        <PhraseItem
          phrase={item}
          categoryColors={categoryColorPair}
          categoryLabel={categoryLabel}
          onPress={handlePhrasePress}
        />
      );
    },
    [categoryColorPair, categoryLabel, handlePhrasePress]
  );

  const keyExtractor = useCallback(
    (item: Phrase) => item.id || Math.random().toString(),
    []
  );

  useEffect(() => {
    fetchPhrases();
  }, [fetchPhrases]);

  if (loading) {
    return (
      <PageView>
        <Topbar
          title={categoryLabel}
          actions={<ProfileButton />}
          showBackButton={true}
        />
        <LoadingState />
      </PageView>
    );
  }

  if (error) {
    return (
      <PageView>
        <Topbar
          title={categoryLabel}
          actions={<ProfileButton />}
          showBackButton={true}
        />
        <ErrorState title="Error al cargar las frases" onRetry={fetchPhrases} />
      </PageView>
    );
  }

  return (
    <PageView>
      <Topbar
        title={categoryLabel}
        actions={<ProfileButton />}
        showBackButton={true}
      />

      <View style={styles.container}>
        <FlatList
          data={phrases}
          renderItem={renderPhraseItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.content}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <EmptyState
              title="No hay frases disponibles"
              description={`No se encontraron frases para ${categoryLabel}.`}
            />
          }
        />

        <PhraseModal
          visible={modalVisible}
          phrase={selectedPhrase}
          categoryColors={categoryColorPair}
          categoryLabel={categoryLabel}
          currentIndex={modalPhraseIndex}
          totalCount={phrases.length}
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
  list: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  content: {
    padding: 16,
  },
});
