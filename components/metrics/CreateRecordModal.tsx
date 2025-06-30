import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { Ionicons } from "@expo/vector-icons";
import { useMetricRecords } from "@/hooks/services/useMetrics";
import { CreateMetricRecordData, Metric } from "@/services/api/metrics.service";
import { AiraVariants } from "@/constants/Themes";
import { useAlertHelpers } from "@/components/ui/AlertSystem";
import { useToastHelpers } from "@/components/ui/ToastSystem";

interface CreateRecordModalProps {
  visible: boolean;
  metric: Metric;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateRecordModal: React.FC<CreateRecordModalProps> = ({
  visible,
  metric,
  onClose,
  onSuccess,
}) => {
  const { createRecord, saving } = useMetricRecords();
  const { showError } = useAlertHelpers();
  const { showSuccessToast, showErrorToast } = useToastHelpers();
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [recordDate, setRecordDate] = useState(new Date());
  const [recordTime, setRecordTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && !recordDate) {
      const now = new Date();
      setRecordDate(now);
      setRecordTime(now);
    }
  }, [visible, recordDate]);

  const resetForm = useCallback(() => {
    setValue("");
    setNotes("");
    const now = new Date();
    setRecordDate(now);
    setRecordTime(now);
    setShowDatePicker(false);
    setShowTimePicker(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const onDateChange = useCallback((event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setRecordDate(selectedDate);
    }
  }, []);

  const onTimeChange = useCallback((event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setRecordTime(selectedTime);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!value.trim()) {
      showError("Error", "El valor es obligatorio");
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      showError("Error", "Ingresa un valor numérico válido");
      return;
    }

    try {
      // Combine date and time
      const finalDateTime = new Date(recordDate);
      finalDateTime.setHours(
        recordTime.getHours(),
        recordTime.getMinutes(),
        0,
        0
      );

      const recordData: CreateMetricRecordData = {
        metricId: metric.id,
        value: numericValue,
        recordDate: finalDateTime.toISOString(),
        notes: notes.trim() || undefined,
      };

      await createRecord(recordData);
      showSuccessToast(
        "Registro creado",
        `${numericValue} ${metric.unit} registrado exitosamente`
      );
      onSuccess();
      resetForm();
    } catch (error) {
      showErrorToast(
        "Error",
        "No se pudo crear el registro. Inténtalo de nuevo."
      );
    }
  }, [
    value,
    recordDate,
    recordTime,
    notes,
    metric.id,
    createRecord,
    onSuccess,
    resetForm,
    showError,
    showSuccessToast,
    showErrorToast,
  ]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={AiraColors.foreground} />
          </TouchableOpacity>
          <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
            Nuevo Registro
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!value.trim() || saving) && styles.saveButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!value.trim() || saving}
          >
            <ThemedText
              style={[
                styles.saveButtonText,
                (!value.trim() || saving) && styles.saveButtonTextDisabled,
              ]}
            >
              {saving ? "Guardando..." : "Guardar"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Información de la métrica */}
          <View style={styles.metricInfo}>
            <ThemedText type="defaultSemiBold" style={styles.metricTitle}>
              {metric.title}
            </ThemedText>
            <ThemedText style={styles.metricUnit}>
              Unidad: {metric.unit}
            </ThemedText>
          </View>

          {/* Valor */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>
              Valor <ThemedText style={styles.required}>*</ThemedText>
            </ThemedText>
            <View style={styles.valueInputContainer}>
              <ThemedInput
                variant="numeric"
                value={value}
                onChangeText={setValue}
                placeholder="0"
                keyboardType="numeric"
              />
              <ThemedText style={styles.unitLabel}>{metric.unit}</ThemedText>
            </View>
          </View>

          {/* Fecha y hora */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Fecha y hora</ThemedText>

            {/* Fecha */}
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                try {
                  setShowDatePicker(true);
                } catch (error) {
                  console.error("Error opening date picker:", error);
                  showErrorToast(
                    "Error",
                    "No se pudo abrir el selector de fecha"
                  );
                }
              }}
            >
              <View style={styles.dateInfo}>
                <ThemedText style={styles.dateText}>
                  📅 {formatDate(recordDate)}
                </ThemedText>
              </View>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={AiraColors.primary}
              />
            </TouchableOpacity>

            {/* Hora */}
            <TouchableOpacity
              style={[styles.dateButton, { marginTop: 8 }]}
              onPress={() => {
                try {
                  setShowTimePicker(true);
                } catch (error) {
                  console.error("Error opening time picker:", error);
                  showErrorToast(
                    "Error",
                    "No se pudo abrir el selector de hora"
                  );
                }
              }}
            >
              <View style={styles.dateInfo}>
                <ThemedText style={styles.dateText}>
                  🕐 {formatTime(recordTime)}
                </ThemedText>
              </View>
              <Ionicons
                name="time-outline"
                size={20}
                color={AiraColors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Notas */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Notas (opcional)</ThemedText>
            <ThemedInput
              variant="textarea"
              value={notes}
              onChangeText={setNotes}
              placeholder="Agrega cualquier observación sobre este registro"
              multiline
              numberOfLines={2}
              maxLength={300}
            />
          </View>

          {/* Objetivos y milestones */}
          {(metric.target || metric.milestones.length > 0) && (
            <View style={styles.section}>
              <ThemedText style={styles.label}>Referencias</ThemedText>

              {metric.target && (
                <View style={styles.referenceItem}>
                  <Ionicons
                    name="flag-outline"
                    size={16}
                    color={AiraColors.primary}
                  />
                  <ThemedText style={styles.referenceText}>
                    Objetivo: {metric.target} {metric.unit}
                  </ThemedText>
                </View>
              )}

              {metric.milestones.slice(0, 3).map((milestone, index) => (
                <View key={index} style={styles.referenceItem}>
                  <Ionicons name="star-outline" size={16} color="#FFA726" />
                  <ThemedText style={styles.referenceText}>
                    Milestone: {milestone.value} {metric.unit}
                    {milestone.description && ` - ${milestone.description}`}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Date Picker */}
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
              value={recordDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              locale="es-ES"
              minimumDate={new Date(2020, 0, 1)}
              maximumDate={new Date(2030, 11, 31)}
            />
          </View>
        )}

        {/* Time Picker */}
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
              value={recordTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onTimeChange}
              locale="es-ES"
              is24Hour={true}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AiraColors.border,
    backgroundColor: AiraColors.card,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    color: AiraColors.foreground,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: AiraColors.primary,
  },
  saveButtonDisabled: {
    backgroundColor: AiraColors.muted,
  },
  saveButtonText: {
    color: AiraColors.primaryForeground,
  },
  saveButtonTextDisabled: {
    color: AiraColors.mutedForeground,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  metricInfo: {
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AiraColors.border,
  },
  metricTitle: {
    fontSize: 16,
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  metricUnit: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: AiraColors.foreground,
    marginBottom: 8,
  },
  required: {
    color: AiraColors.destructive,
  },
  valueInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColors.secondary,
    borderRadius: AiraVariants.cardRadius,
    paddingRight: 16,
  },
  unitLabel: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: AiraColors.card,
  },
  dateInfo: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: AiraColors.foreground,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: AiraColors.foreground,
    backgroundColor: AiraColors.card,
  },
  referenceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: AiraColors.muted,
    borderRadius: 8,
    marginBottom: 8,
  },
  referenceText: {
    marginLeft: 8,
    fontSize: 14,
    color: AiraColors.foreground,
    flex: 1,
  },
  pickerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: AiraColors.card,
  },
  pickerButton: {
    padding: 8,
  },
  pickerButtonText: {
    fontSize: 16,
    color: AiraColors.primary,
  },
});
