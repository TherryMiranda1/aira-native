import React, { useState } from "react";

import { Topbar } from "@/components/ui/Topbar";
import { PageView } from "@/components/ui/PageView";
import { ActionButton } from "@/components/Buttons/ActionButton";

// Importamos los componentes de recetas
import RecipesDashboard from "@/features/recipes/RecipesDashboard";
import RecipesGallery from "@/features/recipes/RecipesGallery";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { ScheduleEventModal } from "@/components/ScheduleEventModal";

interface Ingrediente {
  item: string;
  cantidad: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  time: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  ingredientes: Ingrediente[];
  pasos: string[];
  image: any;
}

export default function RecipesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [viewMode, setViewMode] = useState<"dashboard" | "gallery">(
    "dashboard"
  );
  const [scheduleModal, setScheduleModal] = useState({
    visible: false,
    recipeId: "",
    recipeTitle: "",
  });

  // Función para alternar entre el dashboard y la galería
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "dashboard" ? "gallery" : "dashboard"));
  };

  const onSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    toggleViewMode();
  };

  const handleScheduleRecipe = (recipeId: string, recipeTitle: string) => {
    setScheduleModal({
      visible: true,
      recipeId,
      recipeTitle,
    });
  };

  const handleCloseScheduleModal = () => {
    setScheduleModal({
      visible: false,
      recipeId: "",
      recipeTitle: "",
    });
  };

  return (
    <PageView>
      <Topbar
        title="Recetas 🍽️"
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
        <RecipesDashboard
          onViewAllRecipes={toggleViewMode}
          onSelectCategory={onSelectCategory}
          onScheduleRecipe={handleScheduleRecipe}
        />
      )}
      {viewMode === "gallery" && (
        <RecipesGallery
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onScheduleRecipe={handleScheduleRecipe}
        />
      )}

      {/* Modal de programación */}
      <ScheduleEventModal
        visible={scheduleModal.visible}
        onClose={handleCloseScheduleModal}
        type="recipe"
        itemId={scheduleModal.recipeId}
        itemTitle={scheduleModal.recipeTitle}
      />
    </PageView>
  );
}
