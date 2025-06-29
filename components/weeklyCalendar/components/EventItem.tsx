import React, { useState, useCallback } from "react";
import { StyleSheet, TouchableOpacity, View, Modal } from "react-native";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Event } from "@/services/api/event.service";
import { AiraVariants } from "@/constants/Themes";
import { AiraColors } from "@/constants/Colors";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";

interface EventItemProps {
  event: Event;
  onToggleCompleted: (eventId: string, isCompleted: boolean) => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const eventTypeIcons = {
  personal: "📅",
  recipe: "🍳",
  exercise: "💪",
  challenge: "🏆",
  ritual: "🧘",
  mood: "💭",
};

const eventTypeLabels = {
  personal: "Personal",
  recipe: "Receta",
  exercise: "Ejercicio",
  challenge: "Reto",
  ritual: "Ritual",
  mood: "Estado emocional",
};

const priorityColors = {
  low: AiraColors.mutedForeground,
  medium: AiraColors.primary,
  high: AiraColors.destructive,
  urgent: AiraColors.destructive,
};

export const EventItem: React.FC<EventItemProps> = ({
  event,
  onToggleCompleted,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDeletePress = () => {
    if (event.recurrence && event.recurrence.type !== "none") {
      setDeleteModalVisible(true);
    } else {
      onDelete(event.id);
    }
  };

  const handleDeleteConfirm = (deleteAll: boolean) => {
    setDeleteModalVisible(false);
    onDelete(event.id);
  };

  const getNavigationPath = useCallback(() => {
    if (event.eventType === "recipe" && event.recipeReference?.id) {
      return `/dashboard/recipe/${event.recipeReference.id}`;
    }
    if (event.eventType === "exercise" && event.exerciseReference?.id) {
      return `/dashboard/exercise/${event.exerciseReference.id}`;
    }
    return null;
  }, [event]);

  const handleEventPress = useCallback(() => {
    const navigationPath = getNavigationPath();
    if (navigationPath) {
      router.push(navigationPath as any);
    }
  }, [getNavigationPath, router]);

  const getAdditionalInfo = useCallback(() => {
    if (event.eventType === "recipe" && event.recipeReference) {
      return event.recipeReference.ingrediente_principal || event.recipeReference.categoria;
    }
    if (event.eventType === "exercise" && event.exerciseReference) {
      return event.exerciseReference.tipo_ejercicio || event.exerciseReference.nivel_dificultad;
    }
    if (event.eventType === "challenge" && event.challengeReference) {
      return event.challengeReference.categoria || "Mini Reto";
    }
    if (event.eventType === "ritual" && event.ritualReference) {
      return event.ritualReference.categoria || "Ritual";
    }
    return null;
  }, [event]);

  const getRecurrenceInfo = useCallback(() => {
    if (!event.recurrence || event.recurrence.type === "none") return null;
    
    const recurrenceLabels = {
      daily: "🔄 Diario",
      weekly: "📅 Semanal",
      monthly: "🗓️ Mensual",
      custom: "⚙️ Personalizado",
    };
    
    return recurrenceLabels[event.recurrence.type] || "🔄 Se repite";
  }, [event.recurrence]);

  const eventIcon = eventTypeIcons[event.eventType] || "📅";
  const eventLabel = eventTypeLabels[event.eventType] || "Evento";
  const priorityColor = priorityColors[event.priority] || AiraColors.primary;
  const additionalInfo = getAdditionalInfo();
  const recurrenceInfo = getRecurrenceInfo();
  const navigationPath = getNavigationPath();

  const EventContent = () => (
    <View style={styles.eventContent}>
      <View style={styles.eventHeader}>
        <View style={styles.titleContainer}>
          <ThemedText
            style={[
              styles.eventTitle,
              event.isCompleted && styles.eventCompleted,
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {eventIcon} {event.title}
          </ThemedText>
          {recurrenceInfo && (
            <ThemedText style={styles.recurrenceIndicator}>
              {recurrenceInfo}
            </ThemedText>
          )}
        </View>
        
        <View style={styles.timeContainer}>
          {event.startTime && (
            <ThemedText
              style={[
                styles.eventTime,
                event.isCompleted && styles.eventCompleted,
              ]}
              lightColor={AiraColors.mutedForeground}
              darkColor={AiraColors.mutedForeground}
            >
              {format(new Date(event.startTime), "HH:mm")}
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.eventMeta}>
        <ThemedText
          style={styles.eventType}
          lightColor={AiraColors.mutedForeground}
          darkColor={AiraColors.mutedForeground}
        >
          {eventLabel}
        </ThemedText>
        
        {additionalInfo && (
          <>
            <ThemedText style={styles.metaSeparator}>•</ThemedText>
            <ThemedText
              style={styles.additionalInfo}
              lightColor={AiraColors.mutedForeground}
              darkColor={AiraColors.mutedForeground}
            >
              {additionalInfo}
            </ThemedText>
          </>
        )}
        
        {event.location && (
          <>
            <ThemedText style={styles.metaSeparator}>•</ThemedText>
            <ThemedText
              style={styles.eventLocation}
              lightColor={AiraColors.mutedForeground}
              darkColor={AiraColors.mutedForeground}
            >
              📍 {event.location}
            </ThemedText>
          </>
        )}
      </View>
    </View>
  );

  return (
    <ThemedView
      style={[
        styles.eventItem,
        event.priority === "high" && styles.highPriorityEvent,
        event.priority === "urgent" && styles.urgentEvent,
        navigationPath && styles.clickableEvent,
      ]}
      lightColor={AiraColors.card}
      darkColor={AiraColors.card}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          event.isCompleted && styles.checkboxChecked,
          { borderColor: priorityColor },
          event.isCompleted && { backgroundColor: priorityColor },
        ]}
        onPress={() => onToggleCompleted(event.id, !event.isCompleted)}
      />

      {navigationPath ? (
        <TouchableOpacity 
          style={styles.contentTouchable}
          onPress={handleEventPress}
          activeOpacity={0.7}
        >
          <EventContent />
        </TouchableOpacity>
      ) : (
        <EventContent />
      )}

      <View style={styles.eventActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(event)}
        >
          <ThemedText style={styles.actionIcon}>✏️</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDeletePress}
        >
          <ThemedText style={styles.actionIcon}>🗑️</ThemedText>
        </TouchableOpacity>

        <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ThemedView
              style={styles.modalContent}
              lightColor={AiraColors.card}
              darkColor={AiraColors.card}
            >
              <ThemedText style={styles.modalTitle} type="defaultSemiBold">
                Eliminar evento recurrente
              </ThemedText>

              <ThemedText style={styles.modalText}>
                ¿Deseas eliminar solo esta ocurrencia o todas las ocurrencias de
                este evento?
              </ThemedText>

              <View style={styles.modalButtons}>
                <PrimaryButton
                  text="Cancelar"
                  onPress={() => setDeleteModalVisible(false)}
                  style={styles.modalButton}
                />
                <PrimaryButton
                  text="Solo esta"
                  onPress={() => handleDeleteConfirm(false)}
                  style={styles.modalButton}
                />
                <PrimaryButton
                  text="Todas"
                  onPress={() => handleDeleteConfirm(true)}
                  style={styles.modalButton}
                />
              </View>
            </ThemedView>
          </View>
        </Modal>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  eventItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  clickableEvent: {
    borderWidth: 1,
    borderColor: AiraColors.border + "40",
  },
  highPriorityEvent: {
    borderLeftWidth: 4,
    borderLeftColor: AiraColors.destructive,
  },
  urgentEvent: {
    borderLeftWidth: 4,
    borderLeftColor: AiraColors.destructive,
    backgroundColor: AiraColors.destructive + "10",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxChecked: {
    // backgroundColor is handled dynamically
  },
  contentTouchable: {
    flex: 1,
  },
  eventContent: {
    flex: 1,
    minWidth: 0,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
    minWidth: 0,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 2,
  },
  recurrenceIndicator: {
    fontSize: 11,
    color: AiraColors.primary,
    fontWeight: "500",
  },
  timeContainer: {
    flexShrink: 0,
    alignItems: "flex-end",
  },
  eventTime: {
    fontSize: 14,
    fontWeight: "500",
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  eventType: {
    fontSize: 12,
    fontWeight: "500",
  },
  metaSeparator: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    marginHorizontal: 6,
  },
  additionalInfo: {
    fontSize: 12,
    fontStyle: "italic",
  },
  eventLocation: {
    fontSize: 12,
  },
  eventCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  eventActions: {
    flexDirection: "column",
    marginLeft: 8,
    flexShrink: 0,
  },
  actionButton: {
    padding: 8,
    marginBottom: 4,
    borderRadius: 6,
  },
  actionIcon: {
    fontSize: 16,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    borderRadius: AiraVariants.cardRadius,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },
  modalButton: {
    flex: 1,
    paddingHorizontal: 12,
  },
});
