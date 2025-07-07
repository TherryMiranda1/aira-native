import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Modal } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Task, RecurrenceType } from "@/domain/Task";
import { AiraVariants } from "@/constants/Themes";
import { AiraColors } from "@/constants/Colors";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";

interface TaskItemProps {
  task: Task;
  onToggleDone: (taskId: string) => void;
  onToggleImportant: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDeleteRecurring?: (taskId: string, deleteAll: boolean) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleDone,
  onToggleImportant,
  onEdit,
  onDelete,
  onDeleteRecurring,
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDeletePress = () => {
    // Check if this is a recurring task
    if (task.recurrence && task.recurrence.type !== RecurrenceType.NONE) {
      setDeleteModalVisible(true);
    } else {
      // Regular task deletion
      onDelete(task.id);
    }
  };

  const handleDeleteConfirm = (deleteAll: boolean) => {
    setDeleteModalVisible(false);

    if (onDeleteRecurring) {
      onDeleteRecurring(task.id, deleteAll);
    } else {
      // Fallback to regular delete if onDeleteRecurring not provided
      onDelete(task.id);
    }
  };
  return (
    <ThemedView
      style={[styles.taskItem, task.isImportant && styles.importantTask]}
      variant="foreground"
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          task.isDone && styles.checkboxChecked,
          { borderColor: AiraColors.primary },
          task.isDone && { backgroundColor: AiraColors.primary },
        ]}
        onPress={() => onToggleDone(task.id)}
      />
      <View style={styles.taskContent}>
        <ThemedText style={[styles.taskTitle, task.isDone && styles.taskDone]}>
          {task.title}
        </ThemedText>
        {task.description && (
          <ThemedText
            style={[styles.taskDescription, task.isDone && styles.taskDone]}
            lightColor={AiraColors.secondary}
            darkColor={AiraColors.secondary}
          >
            {task.description}
          </ThemedText>
        )}
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onToggleImportant(task.id)}
        >
          <ThemedText>{task.isImportant ? "⭐" : "☆"}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(task)}
        >
          <ThemedText>✏️</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDeletePress}
        >
          <ThemedText>🗑️</ThemedText>
        </TouchableOpacity>

        {/* Delete confirmation modal for recurring tasks */}
        <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ThemedView
              style={styles.modalContent}
              variant="foreground"
            >
              <ThemedText style={styles.modalTitle} type="defaultSemiBold">
                Eliminar tarea recurrente
              </ThemedText>

              <ThemedText style={styles.modalText}>
                ¿Deseas eliminar solo esta ocurrencia o todas las ocurrencias de
                esta tarea?
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
  taskItem: {
    flexDirection: "row",
    padding: 12,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 10,
    alignItems: "center",
  },
  importantTask: {
    borderLeftWidth: 4,
    // borderLeftColor is handled dynamically
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 10,
  },
  checkboxChecked: {
    // backgroundColor is handled dynamically
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  taskDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  taskDone: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  taskActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
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
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  modalButton: {
    marginHorizontal: 5,
    marginBottom: 10,
  },
});
