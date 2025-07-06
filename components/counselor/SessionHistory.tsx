import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AiraColors } from "@/constants/Colors";
import { Session } from "@/services/api/counselor.service";
import { ThemedText } from "../ThemedText";

interface SessionHistoryProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => Promise<boolean>;
  isLoading: boolean;
}

export default function SessionHistory({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  isLoading,
}: SessionHistoryProps) {
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Hoy";
    if (diffDays === 2) return "Ayer";
    if (diffDays <= 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  const handleDeleteSession = (sessionId: string, sessionName: string) => {
    Alert.alert(
      "Eliminar conversación",
      `¿Estás seguro de que quieres eliminar "${sessionName}"? Esta acción no se puede deshacer.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingSessionId(sessionId);
              await onDeleteSession(sessionId);
            } catch (error) {
              Alert.alert(
                "Error",
                "No se pudo eliminar la conversación. Inténtalo de nuevo."
              );
            } finally {
              setDeletingSessionId(null);
            }
          },
        },
      ]
    );
  };

  const renderSession = ({ item }: { item: Session }) => {
    const isActive = item._id === activeSessionId;
    const isDeleting = deletingSessionId === item._id;
    const lastChat = item.chats[item.chats.length - 1];
    const preview =
      lastChat?.question?.substring(0, 50) + "..." || "Nueva conversación";

    return (
      <View style={[styles.sessionItem, isActive && styles.activeSession]}>
        <TouchableOpacity
          style={styles.sessionContent}
          onPress={() => onSessionSelect(item._id)}
          activeOpacity={0.7}
          disabled={isDeleting}
        >
          <View style={styles.sessionHeader}>
            <ThemedText
              style={[styles.sessionName, isActive && styles.activeSessionText]}
            >
              {item.sessionName}
            </ThemedText>
            <ThemedText style={styles.sessionDate}>
              {formatDate(item.updatedAt)}
            </ThemedText>
          </View>
          <ThemedText style={styles.sessionPreview} numberOfLines={2}>
            {preview}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteSession(item._id, item.sessionName)}
          disabled={isDeleting || isLoading}
          activeOpacity={0.7}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={AiraColors.destructive} />
          ) : (
            <ThemedText style={styles.deleteIcon}>🗑️</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.newSessionButton}
          onPress={onNewSession}
          disabled={isLoading}
        >
          <ThemedText style={styles.newSessionIcon}>+</ThemedText>
          <ThemedText style={styles.newSessionText}>
            Nueva conversación
          </ThemedText>
        </TouchableOpacity>
      </View>

      {isLoading && sessions.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={AiraColors.primary} />
          <ThemedText style={styles.loadingText}>
            Cargando conversaciones...
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={(item) => item._id}
          style={styles.sessionsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sessionsContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.card,
    borderRightWidth: 1,
    borderRightColor: AiraColors.foreground,
  },
  header: {
    padding: 16,
  },
  newSessionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  newSessionIcon: {
    fontSize: 16,
    fontWeight: "500",
    color: AiraColors.foreground,
    marginRight: 8,
  },
  newSessionText: {
    color: AiraColors.foreground,
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    color: AiraColors.mutedForeground,
    fontSize: 14,
  },
  sessionsList: {
    flex: 1,
  },
  sessionsContent: {
    padding: 8,
  },
  sessionItem: {
    backgroundColor: AiraColors.card,
    marginVertical: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  activeSession: {
    backgroundColor: AiraColors.secondary,
  },
  sessionContent: {
    flex: 1,
    padding: 12,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sessionName: {
    fontSize: 14,
    fontWeight: "500",
    color: AiraColors.foreground,
    flex: 1,
  },
  activeSessionText: {
    color: AiraColors.primary,
  },
  sessionDate: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  sessionPreview: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    lineHeight: 16,
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  deleteIcon: {
    fontSize: 16,
  },
});
