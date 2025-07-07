import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ThemedText } from "@/components/ThemedText";
import {
  Event,
  EventCategory,
  CreateEventData,
  UpdateEventData,
  RecurrenceType,
} from "@/services/api/event.service";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { ThemedInput } from "@/components/ThemedInput";
import { getIconById } from "@/components/ui/IconSelector";
import { ModalView } from "@/components/modals/ModalView";
import { AiraVariants } from "@/constants/Themes";
import { ThemedView } from "@/components/ThemedView";

interface EventFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (event: Partial<CreateEventData | UpdateEventData>) => void;
  saving?: boolean;
  initialEvent?: Event;
  selectedDate: Date;
}

const categoryOptions: { value: EventCategory; label: string; icon: string }[] =
  [
    { value: "health", label: "Salud", icon: "🌿" },
    { value: "exercise", label: "Ejercicio", icon: "💪" },
    { value: "nutrition", label: "Alimentación", icon: "🥗" },
    { value: "selfcare", label: "Autocuidado", icon: "💆‍♀️" },
    { value: "personal", label: "Personal", icon: "✨" },
    { value: "work", label: "Trabajo", icon: "💼" },
    { value: "medical", label: "Médico", icon: "🏥" },
    { value: "other", label: "Otros", icon: "📝" },
  ];

const recurrenceOptions: {
  value: RecurrenceType;
  label: string;
  icon: string;
}[] = [
  { value: "none", label: "Una vez", icon: "📅" },
  { value: "daily", label: "Diariamente", icon: "📆" },
  { value: "weekly", label: "Semanalmente", icon: "📅" },
  { value: "monthly", label: "Mensualmente", icon: "🗓️" },
];

export const EventForm: React.FC<EventFormProps> = ({
  visible,
  onClose,
  onSave,
  saving = false,
  initialEvent,
  selectedDate,
}) => {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("personal");
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("personal-1");

  // Initialize form with event data
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setCategory(initialEvent.category);
      setRecurrenceType(initialEvent.recurrence?.type || "none");
      setSelectedIcon(initialEvent.icon || "personal-1");
      const initialDateTime = new Date(initialEvent.startTime);
      setEventDate(initialDateTime);
      setEventTime(initialDateTime);
    } else {
      // Reset form for new event
      setTitle("");
      setCategory("personal");
      setRecurrenceType("none");
      setSelectedIcon("personal-1");
      setEventDate(selectedDate);

      // Set default time to 9:00 AM
      const defaultTime = new Date(selectedDate);
      defaultTime.setHours(9, 0, 0, 0);
      setEventTime(defaultTime);
    }
  }, [initialEvent, visible, selectedDate]);

  const handleSave = () => {
    if (!title.trim() || !user?.id) return;

    // Combine date and time
    const eventStartTime = new Date(eventDate);
    eventStartTime.setHours(eventTime.getHours(), eventTime.getMinutes(), 0, 0);

    const eventData = {
      ...(initialEvent ? {} : { userId: user.id }),
      title,
      startTime: eventStartTime.toISOString(),
      category,
      priority: "medium" as const,
      eventType: "personal" as const,
      color: "purple" as const,
      icon: selectedIcon,
      recurrence: {
        type: recurrenceType,
        interval: 1,
      },
      reminder: { enabled: false },
      tags: [],
      metadata: {
        source: "personal",
        timezone: "America/Mexico_City",
      },
    };

    onSave(eventData);
  };

  const handleClose = () => {
    onClose();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setEventTime(selectedTime);
    }
  };

  return (
    <ModalView
      title=""
      visible={visible}
      onClose={handleClose}
      onSubmit={handleSave}
      submitButtonText="Crear"
      closeButtonText="Cancelar"
      submitButtonIcon="calendar"
      loading={saving}
    >
      {/* Title Input */}
      <View style={styles.section}>
        <ThemedText style={styles.questionText}>
          ¿Qué tienes planeado?
        </ThemedText>
        <ThemedInput
          placeholder="Ej: Cita médica, ejercicio..."
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={AiraColors.mutedForeground}
          autoFocus={!initialEvent}
          multiline
          maxLength={100}
        />
      </View>

      {/* Date Selection */}
      <View style={styles.section}>
        <ThemedText style={styles.questionText}>¿Qué día?</ThemedText>

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <ThemedView variant="secondary" style={styles.dateTimeButton}>
            <ThemedText style={styles.dateTimeButtonText}>
              📅 {format(eventDate, "EEEE, d 'de' MMMM", { locale: es })}
            </ThemedText>
            <ThemedText style={styles.chevron}>›</ThemedText>
          </ThemedView>
        </TouchableOpacity>

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
              value={eventDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              locale="es-ES"
              minimumDate={new Date()}
            />
          </View>
        )}
      </View>

      {/* Time Selection */}
      <View style={styles.section}>
        <ThemedText style={styles.questionText}>¿A qué hora?</ThemedText>

        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <ThemedView variant="secondary" style={styles.dateTimeButton}>
            <ThemedText style={styles.dateTimeButtonText}>
              🕐 {format(eventTime, "HH:mm")}
            </ThemedText>
            <ThemedText style={styles.chevron}>›</ThemedText>
          </ThemedView>
        </TouchableOpacity>

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
              value={eventTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onTimeChange}
              locale="es-ES"
              is24Hour={true}
            />
          </View>
        )}
      </View>

      {/* Category Selection */}
      <View style={styles.section}>
        <ThemedText style={styles.questionText}>Categoría</ThemedText>
        <View style={styles.optionsGrid}>
          {categoryOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                category === option.value && styles.optionCardSelected,
              ]}
              onPress={() => setCategory(option.value)}
            >
              <ThemedText style={styles.optionIcon}>{option.icon}</ThemedText>
              <ThemedText
                style={[
                  styles.optionLabel,
                  category === option.value && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Icon Selection */}
      {/* <View style={styles.section}>
              <ThemedText style={styles.questionText}>Icono</ThemedText>
              <View style={styles.iconSelectorContainer}>
                <IconSelector
                  selectedIcon={selectedIcon}
                  onSelectIcon={setSelectedIcon}
                  categoryFilter={category}
                />
              </View>
            </View> */}

      {/* Recurrence Selection */}
      <View style={styles.section}>
        <ThemedText style={styles.questionText}>¿Se repite?</ThemedText>
        <View style={styles.recurrenceContainer}>
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
              {recurrenceType === option.value && (
                <View style={styles.selectedIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Summary Info */}
      <View style={styles.summaryInfo}>
        <ThemedText style={styles.summaryText}>
          {getIconById(selectedIcon)?.emoji || "📝"} Resumen:{" "}
          {title || "Sin título"} el{" "}
          {format(eventDate, "d 'de' MMMM", { locale: es })} a las{" "}
          {format(eventTime, "HH:mm")}
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
      </View>
    </ModalView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 50 : 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  closeButtonText: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  title: {
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: AiraColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 70,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 16,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 16,
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: AiraVariants.cardRadius,
  },
  dateTimeButtonText: {
    fontSize: 16,
  },
  chevron: {
    fontSize: 20,
    color: AiraColors.mutedForeground,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionCard: {
    flex: 1,
    padding: 4,
    alignItems: "center",
    minWidth: 80,
    borderRadius: AiraVariants.cardRadius,
    maxWidth: "48%",
  },
  optionCardSelected: {
    backgroundColor: AiraColors.primary + "20",
    borderColor: AiraColors.primary,
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    textAlign: "center",
  },
  optionLabelSelected: {
    color: AiraColors.primary,
  },
  recurrenceContainer: {
    gap: 8,
  },
  recurrenceOption: {
    padding: 12,
    borderRadius: AiraVariants.cardRadius,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  recurrenceOptionSelected: {
    backgroundColor: AiraColors.primary + "20",
    borderColor: AiraColors.primary,
  },
  recurrenceIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  recurrenceLabel: {
    fontSize: 16,
    flex: 1,
  },
  recurrenceLabelSelected: {
    color: AiraColors.primary,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AiraColors.primary,
  },
  summaryInfo: {
    marginBottom: 24,
  },
  summaryText: {
    fontSize: 14,
    padding: 12,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
  },
  recurrenceNote: {
    color: AiraColors.primary,
  },
  pickerContainer: {
    marginTop: 16,
    overflow: "hidden",
  },
  pickerHeader: {
    backgroundColor: AiraColors.primary,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  pickerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: AiraVariants.cardRadius,
  },
  pickerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  iconSelectorContainer: {
    padding: 16,
  },
});
