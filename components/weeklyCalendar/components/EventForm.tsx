import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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

  // Initialize form with event data
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setCategory(initialEvent.category);
      setRecurrenceType(initialEvent.recurrence?.type || "none");
      const initialDateTime = new Date(initialEvent.startTime);
      setEventDate(initialDateTime);
      setEventTime(initialDateTime);
    } else {
      // Reset form for new event
      setTitle("");
      setCategory("personal");
      setRecurrenceType("none");
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
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>

            <ThemedText style={styles.title}>
              {initialEvent ? "Editar Plan" : "Nuevo Plan"}
            </ThemedText>

            <TouchableOpacity
              onPress={handleSave}
              disabled={!title.trim() || saving}
              style={[
                styles.saveButton,
                (!title.trim() || saving) && styles.saveButtonDisabled,
              ]}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ThemedText style={styles.saveButtonText}>
                  {initialEvent ? "Actualizar" : "Crear"}
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
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

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedText style={styles.dateTimeButtonText}>
                  📅 {format(eventDate, "EEEE, d 'de' MMMM", { locale: es })}
                </ThemedText>
                <ThemedText style={styles.chevron}>›</ThemedText>
              </TouchableOpacity>

              {showDatePicker && (
                <View style={styles.pickerContainer}>
                  {Platform.OS === "ios" && (
                    <View style={styles.pickerHeader}>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        style={styles.pickerButton}
                      >
                        <ThemedText style={styles.pickerButtonText}>
                          Listo
                        </ThemedText>
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

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <ThemedText style={styles.dateTimeButtonText}>
                  🕐 {format(eventTime, "HH:mm")}
                </ThemedText>
                <ThemedText style={styles.chevron}>›</ThemedText>
              </TouchableOpacity>

              {showTimePicker && (
                <View style={styles.pickerContainer}>
                  {Platform.OS === "ios" && (
                    <View style={styles.pickerHeader}>
                      <TouchableOpacity
                        onPress={() => setShowTimePicker(false)}
                        style={styles.pickerButton}
                      >
                        <ThemedText style={styles.pickerButtonText}>
                          Listo
                        </ThemedText>
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
                    <ThemedText style={styles.optionIcon}>
                      {option.icon}
                    </ThemedText>
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
                📝 Resumen: {title || "Sin título"} el{" "}
                {format(eventDate, "d 'de' MMMM", { locale: es })} a las{" "}
                {format(eventTime, "HH:mm")}
                {recurrenceType !== "none" && (
                  <ThemedText style={styles.recurrenceNote}>
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
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
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
    backgroundColor: AiraColors.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    fontWeight: "600",
    color: AiraColors.foreground,
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
    fontWeight: "600",
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
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 16,
    color: AiraColors.foreground,
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    padding: 16,
    minHeight: 50,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: AiraColors.foreground,
  },
  chevron: {
    fontSize: 20,
    color: AiraColors.mutedForeground,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  optionCard: {
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minWidth: 80,
    flex: 1,
    maxWidth: "48%",
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
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
    color: AiraColors.foreground,
    textAlign: "center",
  },
  optionLabelSelected: {
    color: AiraColors.primary,
    fontWeight: "600",
  },
  recurrenceContainer: {
    gap: 8,
  },
  recurrenceOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
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
    color: AiraColors.foreground,
    flex: 1,
  },
  recurrenceLabelSelected: {
    color: AiraColors.primary,
    fontWeight: "600",
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AiraColors.primary,
  },
  summaryInfo: {
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
  },
  summaryText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
  },
  recurrenceNote: {
    fontStyle: "italic",
    color: AiraColors.primary,
  },
  pickerContainer: {
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    marginTop: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
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
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  pickerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
