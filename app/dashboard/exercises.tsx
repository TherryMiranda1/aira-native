  import React, { useState } from "react";

  import { Topbar } from "@/components/ui/Topbar";
  import { PageView } from "@/components/ui/PageView";
  import { ActionButton } from "@/components/Buttons/ActionButton";

  import ExercisesDashboard from "@/features/exercises/ExercisesDashboard";
  import ExercisesGallery from "@/features/exercises/ExercisesGallery";
  import { ProfileButton } from "@/components/ui/ProfileButton";
  import { ScheduleEventModal } from "@/components/modals/ScheduleEventModal";

  export default function ExercisesScreen() {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
      undefined
    );
    const [viewMode, setViewMode] = useState<"dashboard" | "gallery">(
      "dashboard"
    );
    const [scheduleModal, setScheduleModal] = useState({
      visible: false,
      exerciseId: "",
      exerciseTitle: "",
    });

    const toggleViewMode = () => {
      setViewMode((prev) => (prev === "dashboard" ? "gallery" : "dashboard"));
    };

    const onSelectCategory = (categoryId: string) => {
      setSelectedCategory(categoryId);
      toggleViewMode();
    };

    const handleScheduleExercise = (exerciseId: string, exerciseTitle: string) => {
      setScheduleModal({
        visible: true,
        exerciseId,
        exerciseTitle,
      });
    };

    const handleCloseScheduleModal = () => {
      setScheduleModal({
        visible: false,
        exerciseId: "",
        exerciseTitle: "",
      });
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
            onScheduleExercise={handleScheduleExercise}
          />
        )}
        {viewMode === "gallery" && (
          <ExercisesGallery
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onScheduleExercise={handleScheduleExercise}
          />
        )}

        {/* Modal de programación */}
        <ScheduleEventModal
          visible={scheduleModal.visible}
          onClose={handleCloseScheduleModal}
          type="exercise"
          itemId={scheduleModal.exerciseId}
          itemTitle={scheduleModal.exerciseTitle}
        />
      </PageView>
    );
  }
