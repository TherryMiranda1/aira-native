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
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { Ionicons } from "@expo/vector-icons";
import { useMetrics } from "@/hooks/services/useMetrics";
import { CreateMetricData } from "@/services/api/metrics.service";
import { AiraVariants } from "@/constants/Themes";

interface CreateMetricModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface MilestoneInput {
  value: string;
  description: string;
}

export const CreateMetricModal: React.FC<CreateMetricModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { createMetric, saving } = useMetrics();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [direction, setDirection] = useState<'increase' | 'decrease'>('increase');
  const [target, setTarget] = useState("");
  const [milestones, setMilestones] = useState<MilestoneInput[]>([]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUnit("");
    setDirection('increase');
    setTarget("");
    setMilestones([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addMilestone = () => {
    setMilestones([...milestones, { value: "", description: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (
    index: number,
    field: keyof MilestoneInput,
    value: string
  ) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    if (!unit.trim()) {
      Alert.alert("Error", "La unidad de medida es obligatoria");
      return;
    }

    try {
      const metricData: CreateMetricData = {
        title: title.trim(),
        description: description.trim() || undefined,
        unit: unit.trim(),
        direction,
        target: target.trim() ? parseFloat(target) : undefined,
        milestones: milestones
          .filter((m) => m.value.trim())
          .map((m) => ({
            value: parseFloat(m.value),
            description: m.description.trim() || undefined,
          })),
      };

      await createMetric(metricData);
      onSuccess();
      resetForm();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la métrica. Inténtalo de nuevo.");
    }
  };

  const suggestedUnits = [
    "kg",
    "g",
    "lbs",
    "cm",
    "m",
    "km",
    "pasos",
    "horas",
    "min",
    "seg",
    "litros",
    "ml",
    "veces",
    "%",
    "puntos",
    "días",
    "semanas",
  ];

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
            Nueva Métrica
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!title.trim() || !unit.trim() || saving) &&
                styles.saveButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!title.trim() || !unit.trim() || saving}
          >
            <ThemedText
              style={[
                styles.saveButtonText,
                (!title.trim() || !unit.trim() || saving) &&
                  styles.saveButtonTextDisabled,
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
          {/* Título */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>
              Título <ThemedText style={styles.required}>*</ThemedText>
            </ThemedText>
            <ThemedInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ej: Peso corporal, Pasos diarios, Horas de sueño"
              maxLength={50}
            />
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Descripción</ThemedText>
            <ThemedInput
              variant="textarea"
              value={description}
              onChangeText={setDescription}
              placeholder="Descripción opcional de tu métrica"
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          {/* Unidad */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>
              Unidad de medida{" "}
              <ThemedText style={styles.required}>*</ThemedText>
            </ThemedText>
            <ThemedInput
              value={unit}
              onChangeText={setUnit}
              placeholder="Ej: kg, pasos, horas"
              maxLength={20}
            />
            <View style={styles.suggestedUnits}>
              <ThemedText style={styles.suggestedLabel}>
                Unidades comunes:
              </ThemedText>
              <View style={styles.unitsContainer}>
                {suggestedUnits.map((suggestedUnit) => (
                  <TouchableOpacity
                    key={suggestedUnit}
                    style={styles.unitChip}
                    onPress={() => setUnit(suggestedUnit)}
                  >
                    <ThemedText style={styles.unitChipText}>
                      {suggestedUnit}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Dirección */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>
              Dirección del progreso{" "}
              <ThemedText style={styles.required}>*</ThemedText>
            </ThemedText>
            <ThemedText style={styles.directionDescription}>
              ¿Quieres aumentar o disminuir esta métrica?
            </ThemedText>
            <View style={styles.directionContainer}>
              <TouchableOpacity
                style={[
                  styles.directionOption,
                  direction === 'increase' && styles.directionOptionSelected,
                ]}
                onPress={() => setDirection('increase')}
              >
                <Ionicons 
                  name="trending-up" 
                  size={20} 
                  color={direction === 'increase' ? AiraColors.primaryForeground : AiraColors.foreground} 
                />
                <ThemedText
                  style={[
                    styles.directionText,
                    direction === 'increase' && styles.directionTextSelected,
                  ]}
                >
                  Subir
                </ThemedText>
                <ThemedText
                  style={[
                    styles.directionSubtext,
                    direction === 'increase' && styles.directionSubtextSelected,
                  ]}
                >
                  Aumentar valor
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.directionOption,
                  direction === 'decrease' && styles.directionOptionSelected,
                ]}
                onPress={() => setDirection('decrease')}
              >
                <Ionicons 
                  name="trending-down" 
                  size={20} 
                  color={direction === 'decrease' ? AiraColors.primaryForeground : AiraColors.foreground} 
                />
                <ThemedText
                  style={[
                    styles.directionText,
                    direction === 'decrease' && styles.directionTextSelected,
                  ]}
                >
                  Bajar
                </ThemedText>
                <ThemedText
                  style={[
                    styles.directionSubtext,
                    direction === 'decrease' && styles.directionSubtextSelected,
                  ]}
                >
                  Disminuir valor
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Objetivo */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Objetivo (opcional)</ThemedText>
            <ThemedInput
              variant="numeric"
              value={target}
              onChangeText={setTarget}
              placeholder="Valor numérico de tu objetivo"
              keyboardType="numeric"
            />
          </View>

          {/* Milestones */}
          <View style={styles.section}>
            <View style={styles.milestonesHeader}>
              <ThemedText style={styles.label}>
                Milestones (opcional)
              </ThemedText>
              <TouchableOpacity style={styles.addButton} onPress={addMilestone}>
                <Ionicons name="add" size={20} color={AiraColors.primary} />
                <ThemedText style={styles.addButtonText}>Agregar</ThemedText>
              </TouchableOpacity>
            </View>

            {milestones.map((milestone, index) => (
              <View key={index} style={styles.milestoneContainer}>
                <View style={styles.milestoneInputs}>
                  <ThemedInput
                    style={styles.milestoneValueInput}
                    variant="numeric"
                    value={milestone.value}
                    onChangeText={(value) =>
                      updateMilestone(index, "value", value)
                    }
                    placeholder="Valor"
                    keyboardType="numeric"
                  />
                  <ThemedInput
                    style={styles.milestoneDescInput}
                    value={milestone.description}
                    onChangeText={(value) =>
                      updateMilestone(index, "description", value)
                    }
                    placeholder="Descripción (opcional)"
                  />
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeMilestone(index)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={AiraColors.destructive}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
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
    fontWeight: "600",
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
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 8,
  },
  required: {
    color: AiraColors.destructive,
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  suggestedUnits: {
    marginTop: 12,
  },
  suggestedLabel: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 8,
  },
  unitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: AiraColors.muted,
    borderRadius: 16,
  },
  unitChipText: {
    fontSize: 12,
    color: AiraColors.foreground,
  },
  milestonesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: AiraColors.muted,
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: AiraColors.primary,
    fontWeight: "600",
  },
  milestoneContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  milestoneInputs: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  milestoneValueInput: {
    flex: 1,
  },
  milestoneDescInput: {
    flex: 2,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  directionDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 12,
  },
  directionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  directionOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: AiraColors.border,
    backgroundColor: AiraColors.card,
  },
  directionOptionSelected: {
    borderColor: AiraColors.primary,
    backgroundColor: AiraColors.primary,
  },
  directionText: {
    fontSize: 16,
    fontWeight: '600',
    color: AiraColors.foreground,
    marginTop: 8,
  },
  directionTextSelected: {
    color: AiraColors.primaryForeground,
  },
  directionSubtext: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    marginTop: 2,
  },
  directionSubtextSelected: {
    color: AiraColors.primaryForeground,
  },
});
