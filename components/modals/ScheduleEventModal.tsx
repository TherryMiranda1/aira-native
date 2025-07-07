import React, { useState } from "react";
import {
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, addHours } from "date-fns";
import { es } from "date-fns/locale";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedInput } from "@/components/ThemedInput";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { eventService, RecurrenceType } from "@/services/api/event.service";
import { useAlertHelpers } from "@/components/ui/AlertSystem";
import { useToastHelpers } from "@/components/ui/ToastSystem";
import { ModalView } from "./ModalView";
import { AiraVariants } from "@/constants/Themes";

interface ScheduleEventModalProps {
  visible: boolean;
  onClose: () => void;
  type: "recipe" | "exercise" | "challenge" | "ritual";
  itemId: string;
  itemTitle: string;
  onSuccess?: () => void;
}

const recurrenceOptions: {
  value: RecurrenceType;
  label: string;
  icon: string;
}[] = [
  { value: "none", label: "Una vez", icon: "📅" },
  { value: "daily", label: "Todos los días", icon: "📆" },
  { value: "weekly", label: "Cada semana", icon: "📅" },
  { value: "monthly", label: "Cada mes", icon: "🗓️" },
];

export const ScheduleEventModal: React.FC<ScheduleEventModalProps> = ({
  visible,
  onClose,
  type,
  itemId,
  itemTitle,
  onSuccess,
}) => {
  const { user } = useUser();
  const { showError } = useAlertHelpers();
  const { showSuccessToast, showErrorToast } = useToastHelpers();

  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(addHours(new Date(), 1));
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const getIcon = () => {
    if (type === "recipe") {
      return "restaurant-outline";
    } else if (type === "exercise") {
      return "fitness-outline";
    } else if (type === "ritual") {
      return "sparkles-outline";
    } else {
      return "trophy-outline";
    }
  };

  const getTitle = () => {
    if (type === "recipe") {
      return "Programar Receta";
    } else if (type === "exercise") {
      return "Programar Ejercicio";
    } else if (type === "ritual") {
      return "Programar Ritual";
    } else {
      return "Programar Mini Reto";
    }
  };

  const getDefaultLocation = () => {
    if (type === "recipe") {
      return "Cocina";
    } else if (type === "exercise") {
      return "Gimnasio";
    } else if (type === "ritual") {
      return "Espacio tranquilo";
    } else {
      return "Casa";
    }
  };

  const getItemTypeLabel = () => {
    if (type === "recipe") {
      return "Receta:";
    } else if (type === "exercise") {
      return "Ejercicio:";
    } else if (type === "ritual") {
      return "Ritual:";
    } else {
      return "Mini Reto:";
    }
  };

  const getSuccessMessage = () => {
    if (type === "recipe") {
      return "Tu receta se ha añadido a tu calendario";
    } else if (type === "exercise") {
      return "Tu ejercicio se ha añadido a tu calendario";
    } else if (type === "ritual") {
      return "Tu ritual se ha añadido a tu calendario";
    } else {
      return "Tu mini reto se ha añadido a tu calendario";
    }
  };

  const resetForm = () => {
    setStartTime(addHours(new Date(), 1));
    setRecurrenceType("none");
    setLocation("");
    setNotes("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(startTime.getHours(), startTime.getMinutes());
      setStartTime(newDateTime);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDateTime = new Date(startTime);
      newDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setStartTime(newDateTime);
    }
  };

  const handleSchedule = async () => {
    if (!user?.id) {
      showError("Error", "Debes estar autenticada para programar eventos");
      return;
    }

    setLoading(true);

    try {
      const options = {
        recurrence:
          recurrenceType !== "none" ? { type: recurrenceType } : undefined,
        location: location || getDefaultLocation(),
        notes,
      };

      if (type === "recipe") {
        await eventService.createRecipeEvent(
          user.id,
          itemId,
          itemTitle,
          startTime.toISOString(),
          options
        );
      } else if (type === "exercise") {
        await eventService.createExerciseEvent(
          user.id,
          itemId,
          itemTitle,
          startTime.toISOString(),
          options
        );
      } else if (type === "challenge") {
        await eventService.createChallengeEvent(
          user.id,
          itemId,
          itemTitle,
          startTime.toISOString(),
          options
        );
      } else if (type === "ritual") {
        await eventService.createRitualEvent(
          user.id,
          itemId,
          itemTitle,
          startTime.toISOString(),
          options
        );
      }

      showSuccessToast("¡Evento programado! ✨", getSuccessMessage());
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error scheduling event:", error);
      showErrorToast(
        "Error",
        "No se pudo programar el evento. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalView
      visible={visible}
      submitButtonText="Añadir"
      closeButtonText="Cancelar"
      onClose={handleClose}
      onSubmit={handleSchedule}
      title={getTitle()}
    >
      <View style={styles.itemInfo}>
        <ThemedText style={styles.itemTypeLabel}>
          {getItemTypeLabel()}
        </ThemedText>
        <ThemedText style={styles.itemTitle}>{itemTitle}</ThemedText>
      </View>

      {/* Date Selection */}
      <View style={styles.section}>
        <ThemedText style={styles.label}>
          ¿Cuándo quieres realizarlo?
        </ThemedText>

        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setShowDatePicker(true)}
        >
          <View style={styles.dateTimeContent}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={AiraColors.primary}
            />
            <ThemedText style={styles.dateTimeText}>
              {format(startTime, "EEEE, d 'de' MMMM", { locale: es })}
            </ThemedText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={AiraColors.mutedForeground}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setShowTimePicker(true)}
        >
          <View style={styles.dateTimeContent}>
            <Ionicons
              name="time-outline"
              size={20}
              color={AiraColors.primary}
            />
            <ThemedText style={styles.dateTimeText}>
              {format(startTime, "HH:mm")}
            </ThemedText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={AiraColors.mutedForeground}
          />
        </TouchableOpacity>
      </View>

      {/* Recurrence Selection */}
      <View style={styles.section}>
        <ThemedText style={styles.label}>¿Se repite?</ThemedText>
        <View style={styles.recurrenceGrid}>
          {recurrenceOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.recurrenceOption,
                recurrenceType === option.value &&
                  styles.recurrenceOptionSelected,
              ]}
              onPress={() => setRecurrenceType(option.value)}
            >
              <ThemedText style={styles.recurrenceIcon}>
                {option.icon}
              </ThemedText>
              <ThemedText
                style={[
                  styles.recurrenceLabel,
                  recurrenceType === option.value &&
                    styles.recurrenceLabelSelected,
                ]}
              >
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Location */}
      <View style={styles.section}>
        <ThemedText style={styles.label}>Ubicación (opcional)</ThemedText>
        <ThemedInput
          value={location}
          onChangeText={setLocation}
          placeholder={getDefaultLocation()}
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <ThemedText style={styles.label}>Notas (opcional)</ThemedText>
        <ThemedInput
          variant="textarea"
          value={notes}
          onChangeText={setNotes}
          placeholder="Notas adicionales..."
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Summary */}
      <ThemedView variant="border" style={styles.summary}>
        <ThemedText style={styles.summaryText}>
          📅 Resumen: {itemTitle} el{" "}
          {format(startTime, "d 'de' MMMM", { locale: es })} a las{" "}
          {format(startTime, "HH:mm")}
          {recurrenceType !== "none" && (
            <ThemedText type="defaultItalic" style={styles.recurrenceNote}>
              {" "}
              (
              {recurrenceOptions
                .find((opt) => opt.value === recurrenceType)
                ?.label.toLowerCase()}
              )
            </ThemedText>
          )}
        </ThemedText>
      </ThemedView>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <View style={styles.pickerContainer}>
          {Platform.OS === "ios" && (
            <View style={styles.pickerHeader}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.pickerButton}
              >
                <ThemedText style={styles.pickerButtonText}>Listo</ThemedText>
              </TouchableOpacity>
            </View>
          )}
          <DateTimePicker
            value={startTime}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            locale="es-ES"
            minimumDate={new Date()}
          />
        </View>
      )}

      {showTimePicker && (
        <View style={styles.pickerContainer}>
          {Platform.OS === "ios" && (
            <View style={styles.pickerHeader}>
              <TouchableOpacity
                onPress={() => setShowTimePicker(false)}
                style={styles.pickerButton}
              >
                <ThemedText style={styles.pickerButtonText}>Listo</ThemedText>
              </TouchableOpacity>
            </View>
          )}
          <DateTimePicker
            value={startTime}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
            locale="es-ES"
            is24Hour={true}
          />
        </View>
      )}
    </ModalView>
  );
};

const styles = StyleSheet.create({
  itemInfo: {
    padding: 16,
    borderRadius: AiraVariants.cardRadius,
    marginTop: 16,
    marginBottom: 8,
  },
  itemTypeLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
  },
  section: {
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
  },
  dateTimeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimeText: {
    fontSize: 16,
    color: AiraColors.foreground,
    marginLeft: 8,
  },
  recurrenceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  recurrenceOption: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    minWidth: "48%",
  },
  recurrenceOptionSelected: {
    backgroundColor: AiraColors.primary,
  },
  recurrenceIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  recurrenceLabel: {
    fontSize: 14,
  },
  recurrenceLabelSelected: {
    color: AiraColors.mutedForeground,
  },
  textArea: {
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  summary: {
    padding: 16,
    borderRadius: AiraVariants.cardRadius,
    marginTop: 16,
    marginBottom: 24,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  recurrenceNote: {
    color: AiraColors.mutedForeground,
  },
  pickerContainer: {
    borderTopWidth: 1,
    borderTopColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
    borderRadius: AiraVariants.cardRadius,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  pickerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pickerButtonText: {
    fontSize: 16,
    color: AiraColors.primary,
  },
});
