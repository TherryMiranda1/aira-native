import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { AiraColors } from "@/constants/Colors";
import { useCounselorAgent } from "@/hooks/agent/useCounselorAgent";
import SessionHistory from "./SessionHistory";
import ChatInterface from "./ChatInterface";
import InfoModal from "./InfoModal";
import { ThemedText } from "../ThemedText";
import { Topbar } from "../ui/Topbar";
import { ProfileButton } from "../ui/ProfileButton";

export default function CounselorView() {
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const {
    messages,
    pagination,
    isLoading,
    processUserMessage,
    sessions,
    activeSessionId,
    setActiveSession,
    createNewSession,
    deleteSession,
    loadPreviousMessages,
  } = useCounselorAgent();

  if (sessions.length === 0 && isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AiraColors.primary} />
        <ThemedText style={styles.loadingText}>
          Cargando tu espacio personal...
        </ThemedText>
      </View>
    );
  }

  const handleSessionSelect = (sessionId: string) => {
    setActiveSession(sessionId);
    setShowSessionHistory(false);
  };

  const handleNewSession = () => {
    createNewSession();
    setShowSessionHistory(false);
  };

  return (
    <View style={styles.container}>
      <Topbar
        title="Aira"
        leftActions={
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowSessionHistory(true)}
          >
            <ThemedText style={styles.menuIcon}>☰</ThemedText>
          </TouchableOpacity>
        }
        actions={
          <>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => setShowInfoModal(true)}
            >
              <ThemedText style={styles.infoIcon}>ⓘ</ThemedText>
            </TouchableOpacity>
            <ProfileButton />
          </>
        }
      />

      <ChatInterface
        messages={messages}
        isLoading={isLoading}
        onSendMessage={processUserMessage}
        pagination={pagination}
        onLoadMore={loadPreviousMessages}
      />
      <Modal
        visible={showSessionHistory}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSessionHistory(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
              Conversaciones
            </ThemedText>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSessionHistory(false)}
            >
              <ThemedText style={styles.closeButtonText}>Cerrar</ThemedText>
            </TouchableOpacity>
          </View>

          <SessionHistory
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
            onDeleteSession={deleteSession}
            isLoading={isLoading}
          />
        </View>
      </Modal>

      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.card,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AiraColors.card,
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: AiraColors.primary,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AiraColors.card,
    borderBottomWidth: 1,
    borderBottomColor: AiraColors.border,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AiraColors.secondary,
  },
  menuIcon: {
    fontSize: 18,
    color: AiraColors.mutedForeground,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AiraColors.secondary,
  },
  infoIcon: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: AiraColors.card,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: AiraColors.card,
    borderBottomWidth: 1,
    borderBottomColor: AiraColors.border,
  },
  modalTitle: {
    fontSize: 18,
    color: AiraColors.foreground,
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closeButtonText: {
    color: AiraColors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
});
