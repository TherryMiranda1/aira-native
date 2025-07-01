import { PageView } from "@/components/ui/PageView";
import { router } from "expo-router";
import RevenueCatUI from "react-native-purchases-ui";

export default function DefaultPaywall() {
  return (
    <PageView>
      <RevenueCatUI.Paywall
        onDismiss={() =>
          router.canGoBack() ? router.back() : router.replace("/")
        }
      />
    </PageView>
  );
}
