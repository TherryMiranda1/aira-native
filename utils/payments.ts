import { PurchasesOffering } from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

export const presentPaywall = async (offering: PurchasesOffering) => {
  await RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: "pro",
    offering,
  });
};

export const isProUser = async () => {
  const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: "pro",
  });

  switch (paywallResult) {
    case PAYWALL_RESULT.NOT_PRESENTED:
    case PAYWALL_RESULT.ERROR:
    case PAYWALL_RESULT.CANCELLED:
      return false;
    case PAYWALL_RESULT.PURCHASED:
    case PAYWALL_RESULT.RESTORED:
      return true;
    default:
      return false;
  }
};
