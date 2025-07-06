import React from "react";
import { StyleSheet } from "react-native";
import { AiraColors } from "@/constants/Colors";
import { PageView } from "@/components/ui/PageView";
import CounselorView from "@/components/counselor/CounselorView";

export default function ChatScreen() {
  return (
    <PageView style={styles.container}>
      <CounselorView />
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.card,
  },
  subtitle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: AiraColors.card,
    borderBottomWidth: 1,
    borderBottomColor: AiraColors.border,
  },
  subtitleText: {
    color: AiraColors.mutedForeground,
    fontSize: 14,
    textAlign: "center",
  },
});
