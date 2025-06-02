import React, { useState } from "react";
import { View } from "react-native";

import { Topbar } from "@/components/ui/Topbar";
import { PageView } from "@/components/ui/PageView";
import { ActionButton } from "@/components/Buttons/ActionButton";

import ExercisesDashboard from "@/features/exercises/ExercisesDashboard";
import ExercisesGallery from "@/features/exercises/ExercisesGallery";
import { ProfileButton } from "@/components/ui/ProfileButton";

export default function ExercisesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [viewMode, setViewMode] = useState<"dashboard" | "gallery">(
    "dashboard"
  );

  // Función para alternar entre el dashboard y la galería
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "dashboard" ? "gallery" : "dashboard"));
  };

  const onSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    toggleViewMode();
  };

  return (
    <PageView>
      <Topbar
        title="Ejercicios 💪"
        actions={
          <>
            <ActionButton
              onPress={toggleViewMode}
              icon={viewMode === "dashboard" ? "grid-outline" : "list-outline"}
            />
            <ProfileButton />
          </>
        }
      />

      {/* Renderizado condicional entre Dashboard y Gallery */}
      {viewMode === "dashboard" && (
        <ExercisesDashboard
          onViewAllExercises={toggleViewMode}
          onSelectCategory={onSelectCategory}
        />
      )}
      {viewMode === "gallery" && (
        <ExercisesGallery
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
    </PageView>
  );
}
