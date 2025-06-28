import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Modal } from "react-native";
import { format } from "date-fns";
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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDeletePress = () => {
    // Check if this is a recurring event
    if (event.recurrence && event.recurrence.type !== "none") {
      setDeleteModalVisible(true);
    } else {
      // Regular event deletion
      onDelete(event.id);
    }
  };

  const handleDeleteConfirm = (deleteAll: boolean) => {
    setDeleteModalVisible(false);
    // For now, just delete the single event
    // TODO: Implement series deletion for recurring events
    onDelete(event.id);
  };

  const eventIcon = eventTypeIcons[event.eventType] || "📅";
  const eventLabel = eventTypeLabels[event.eventType] || "Evento";
  const priorityColor = priorityColors[event.priority] || AiraColors.primary;

  return (
    <ThemedView
      style={[
        styles.eventItem,
        event.priority === "high" && styles.highPriorityEvent,
        event.priority === "urgent" && styles.urgentEvent,
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

      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <ThemedText
            style={[
              styles.eventTitle,
              event.isCompleted && styles.eventCompleted,
            ]}
          >
            {eventIcon} {event.title}
          </ThemedText>
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

        {event.description && (
          <ThemedText
            style={[
              styles.eventDescription,
              event.isCompleted && styles.eventCompleted,
            ]}
            lightColor={AiraColors.mutedForeground}
            darkColor={AiraColors.mutedForeground}
          >
            {event.description}
          </ThemedText>
        )}

        <View style={styles.eventMeta}>
          <ThemedText
            style={styles.eventType}
            lightColor={AiraColors.mutedForeground}
            darkColor={AiraColors.mutedForeground}
          >
            {eventLabel}
          </ThemedText>
          {event.location && (
            <ThemedText
              style={styles.eventLocation}
              lightColor={AiraColors.mutedForeground}
              darkColor={AiraColors.mutedForeground}
            >
              📍 {event.location}
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.eventActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(event)}
        >
          <ThemedText>✏️</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDeletePress}
        >
          <ThemedText>🗑️</ThemedText>
        </TouchableOpacity>

        {/* Delete confirmation modal for recurring events */}
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
  },
  checkboxChecked: {
    // backgroundColor is handled dynamically
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  eventTitle: {
    fontWeight: "600",
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  eventTime: {
    fontSize: 14,
     
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  eventType: {
    fontSize: 12,
     
  },
  eventLocation: {
    fontSize: 12,
  },
  eventCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  eventActions: {
    flexDirection: "row",
    marginLeft: 8,
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
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
