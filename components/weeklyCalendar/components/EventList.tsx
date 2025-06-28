import { format } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView } from "../../Views/ThemedScrollView";
import { Event } from "@/services/api/event.service";
import { EventItem } from "./EventItem";
import { AiraColors } from "@/constants/Colors";

interface EventListProps {
  selectedDate: Date;
  events: Event[];
  loading?: boolean;
  onAddEvent: () => void;
  onToggleCompleted: (eventId: string, isCompleted: boolean) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventList: React.FC<EventListProps> = ({
  selectedDate,
  events,
  loading = false,
  onAddEvent,
  onToggleCompleted,
  onEditEvent,
  onDeleteEvent,
}) => {
  return (
    <View style={styles.contentContainer}>
      <View style={styles.contentHeader}>
        <ThemedText type="small">
          {format(selectedDate, "dd 'de' MMMM yyyy", { locale: es })}
        </ThemedText>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: AiraColors.primary }]}
          onPress={onAddEvent}
        >
          <ThemedText
            style={styles.addButtonText}
            lightColor={AiraColors.background}
            darkColor={AiraColors.background}
          >
            +
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedScrollView style={styles.eventList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AiraColors.primary} />
            <ThemedText style={styles.loadingText}>
              Cargando eventos...
            </ThemedText>
          </View>
        ) : events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText
              style={styles.emptyText}
              lightColor={AiraColors.mutedForeground}
              darkColor={AiraColors.mutedForeground}
            >
              No hay eventos para este día.
            </ThemedText>
            <TouchableOpacity
              style={styles.createEventButton}
              onPress={onAddEvent}
            >
              <ThemedText style={styles.createEventText}>
                Crear evento
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              onToggleCompleted={onToggleCompleted}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
            />
          ))
        )}
      </ThemedScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  eventList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  createEventButton: {
    backgroundColor: AiraColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createEventText: {
    color: AiraColors.background,
    fontSize: 14,
    fontWeight: "600",
  },
}); 