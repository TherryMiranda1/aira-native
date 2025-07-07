import React from "react";
import { PageView } from "@/components/ui/PageView";
import CounselorView from "@/components/counselor/CounselorView";

export default function ChatScreen() {
  return (
    <PageView safeAreaBottom={false}>
      <CounselorView />
    </PageView>
  );
}
