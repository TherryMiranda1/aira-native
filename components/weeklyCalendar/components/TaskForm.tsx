import React, { useState } from "react";
import {
  StyleSheet,
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Task, RecurrenceType } from "@/domain/Task";
import { AiraVariants } from "@/constants/Themes";
import { AiraColors } from "@/constants/Colors";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { getDay } from "date-fns";

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialTask?: Partial<Task>;
  selectedDate: Date;
}

interface DayOption {
  id: number;
  name: string;
  shortName: string;
}

const DAYS_OF_WEEK: DayOption[] = [
  { id: 0, name: "Domingo", shortName: "D" },
  { id: 1, name: "Lunes", shortName: "L" },
  { id: 2, name: "Martes", shortName: "M" },
  { id: 3, name: "Miércoles", shortName: "X" },
  { id: 4, name: "Jueves", shortName: "J" },
  { id: 5, name: "Viernes", shortName: "V" },
  { id: 6, name: "Sábado", shortName: "S" },
];

export const TaskForm: React.FC<TaskFormProps> = ({
  visible,
  onClose,
  onSave,
  initialTask,
  selectedDate,
}) => {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || ""
  );
  const [isImportant, setIsImportant] = useState(
    initialTask?.isImportant || false
  );

  // Recurrence state
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(
    initialTask?.recurrence?.type || RecurrenceType.NONE
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initialTask?.recurrence?.days || [getDay(selectedDate)]
  );

  const toggleDay = (dayId: number) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((id) => id !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    // Prepare recurrence data if applicable
    let recurrence = undefined;

    if (recurrenceType !== RecurrenceType.NONE) {
      recurrence = {
        type: recurrenceType,
        days:
          recurrenceType === RecurrenceType.MULTIPLE_DAYS
            ? selectedDays
            : undefined,
      };
    }

    onSave({
      id: initialTask?.id,
      title,
      description,
      isImportant,
      date: selectedDate,
      categories: [],
      recurrence,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setIsImportant(false);
    setRecurrenceType(RecurrenceType.NONE);
    setSelectedDays([getDay(selectedDate)]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ThemedView style={styles.modalContent} variant="foreground">
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: AiraColors.border,
                  backgroundColor: AiraColors.card,
                },
              ]}
              placeholder="Título"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={AiraColors.mutedForeground}
            />

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  borderColor: AiraColors.border,
                  backgroundColor: AiraColors.card,
                },
              ]}
              placeholder="Descripción (opcional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor={AiraColors.mutedForeground}
            />

            <View style={styles.checkboxContainer}>
              <ThemedText type="defaultSemiBold">Importante</ThemedText>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  isImportant && styles.checkboxChecked,
                  { borderColor: AiraColors.primary },
                  isImportant && { backgroundColor: AiraColors.primary },
                ]}
                onPress={() => setIsImportant(!isImportant)}
              />
            </View>

            {/* Recurrence options */}
            <View style={styles.recurrenceSection}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Recurrencia
              </ThemedText>

              <View style={styles.recurrenceOptions}>
                <TouchableOpacity
                  style={[
                    styles.recurrenceOption,
                    recurrenceType === RecurrenceType.NONE &&
                      styles.selectedRecurrenceOption,
                  ]}
                  onPress={() => setRecurrenceType(RecurrenceType.NONE)}
                >
                  <ThemedText>Ninguna</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.recurrenceOption,
                    recurrenceType === RecurrenceType.DAILY &&
                      styles.selectedRecurrenceOption,
                  ]}
                  onPress={() => setRecurrenceType(RecurrenceType.DAILY)}
                >
                  <ThemedText>Diaria</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.recurrenceOption,
                    recurrenceType === RecurrenceType.WEEKLY &&
                      styles.selectedRecurrenceOption,
                  ]}
                  onPress={() => {
                    setRecurrenceType(RecurrenceType.WEEKLY);
                    setSelectedDays([getDay(selectedDate)]);
                  }}
                >
                  <ThemedText>Semanal</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.recurrenceOption,
                    recurrenceType === RecurrenceType.MULTIPLE_DAYS &&
                      styles.selectedRecurrenceOption,
                  ]}
                  onPress={() =>
                    setRecurrenceType(RecurrenceType.MULTIPLE_DAYS)
                  }
                >
                  <ThemedText>Múltiples días</ThemedText>
                </TouchableOpacity>
              </View>

              {/* Day selector for multiple days recurrence */}
              {recurrenceType === RecurrenceType.MULTIPLE_DAYS && (
                <View style={styles.daysContainer}>
                  <ThemedText type="defaultSemiBold" style={styles.daysTitle}>
                    Selecciona los días:
                  </ThemedText>
                  <View style={styles.daysGrid}>
                    {DAYS_OF_WEEK.map((day) => (
                      <TouchableOpacity
                        key={day.id}
                        style={[
                          styles.dayButton,
                          selectedDays.includes(day.id) &&
                            styles.selectedDayButton,
                        ]}
                        onPress={() => toggleDay(day.id)}
                      >
                        <ThemedText
                          style={
                            selectedDays.includes(day.id)
                              ? styles.selectedDayText
                              : undefined
                          }
                          lightColor={
                            selectedDays.includes(day.id)
                              ? AiraColors.background
                              : undefined
                          }
                          darkColor={
                            selectedDays.includes(day.id)
                              ? AiraColors.background
                              : undefined
                          }
                        >
                          {day.shortName}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Display recurrence summary */}
              {recurrenceType !== RecurrenceType.NONE && (
                <View style={styles.recurrenceSummary}>
                  <ThemedText
                    style={styles.summaryText}
                    lightColor={AiraColors.secondary}
                  >
                    {recurrenceType === RecurrenceType.DAILY &&
                      "Esta tarea se repetirá todos los días"}
                    {recurrenceType === RecurrenceType.WEEKLY &&
                      `Esta tarea se repetirá todos los ${
                        DAYS_OF_WEEK.find((d) => d.id === getDay(selectedDate))
                          ?.name || "días"
                      }`}
                    {recurrenceType === RecurrenceType.MULTIPLE_DAYS &&
                      selectedDays.length > 0 &&
                      `Esta tarea se repetirá los días: ${selectedDays
                        .map(
                          (dayId) =>
                            DAYS_OF_WEEK.find((d) => d.id === dayId)?.name
                        )
                        .join(", ")}`}
                  </ThemedText>
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <PrimaryButton text="Cancelar" onPress={onClose} />
              <PrimaryButton text="Guardar" onPress={handleSave} />
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: AiraVariants.cardRadius,
    padding: 20,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    fontFamily: "Montserrat",
    borderRadius: AiraVariants.cardRadius,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
  },
  checkboxChecked: {
    // backgroundColor is handled dynamically
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 10,
  },
  recurrenceSection: {
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 16,
  },
  recurrenceOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  recurrenceOption: {
    padding: 8,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 8,
    minWidth: "48%",
    alignItems: "center",
  },
  selectedRecurrenceOption: {
    backgroundColor: AiraColors.primary,
    borderColor: AiraColors.primary,
  },
  daysContainer: {
    marginTop: 10,
  },
  daysTitle: {
    marginBottom: 10,
  },
  daysGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  dayButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    margin: 4,
  },
  selectedDayButton: {
    backgroundColor: AiraColors.primary,
    borderColor: AiraColors.primary,
  },
  selectedDayText: {
    fontWeight: "bold",
  },
  recurrenceSummary: {
    marginTop: 15,
    padding: 10,
    borderRadius: AiraVariants.cardRadius,
    backgroundColor: AiraColors.muted,
  },
  summaryText: {
    fontSize: 14,
    textAlign: "center",
  },
});
