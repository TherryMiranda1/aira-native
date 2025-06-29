import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
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
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [recordDate, setRecordDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const resetForm = () => {
    setValue("");
    setNotes("");
    setRecordDate(new Date());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setRecordDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!value.trim()) {
      Alert.alert("Error", "El valor es obligatorio");
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      Alert.alert("Error", "Ingresa un valor numérico válido");
      return;
    }

    try {
      const recordData: CreateMetricRecordData = {
        metricId: metric.id,
        value: numericValue,
        recordDate: recordDate.toISOString(),
        notes: notes.trim() || undefined,
      };

      await createRecord(recordData);
      onSuccess();
      resetForm();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el registro. Inténtalo de nuevo.");
    }
  };

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
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.dateInfo}>
                <ThemedText style={styles.dateText}>
                  {formatDate(recordDate)}
                </ThemedText>
                <ThemedText style={styles.timeText}>
                  {formatTime(recordDate)}
                </ThemedText>
              </View>
              <Ionicons
                name="calendar-outline"
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
              numberOfLines={4}
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
          <DateTimePicker
            value={recordDate}
            mode="datetime"
            display="default"
            onChange={handleDateChange}
          />
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
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: 8,
    backgroundColor: AiraColors.card,
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
  timeText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
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
});
