import { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

export type PlanType = 'free' | 'basic' | 'pro';

export interface SubscriptionPlan {
  id: PlanType;
  name: string;
  price: number;
  productId?: string;
  entitlementId?: string;
  features: string[];
  isPopular?: boolean;
}

export interface SubscriptionState {
  isLoading: boolean;
  hasActiveSubscription: boolean;
  currentPlan: PlanType;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering[] | null;
  error: string | null;
}

export interface PurchaseResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}

export interface SubscriptionContextType {
  // Estado
  subscriptionState: SubscriptionState;
  
  // Acciones
  initializeRevenueCat: () => Promise<void>;
  purchasePackage: (packageToPurchase: PurchasesPackage) => Promise<PurchaseResult>;
  restorePurchases: () => Promise<PurchaseResult>;
  getOfferings: () => Promise<PurchasesOffering[] | null>;
  checkSubscriptionStatus: () => Promise<void>;
  
  // Utilidades
  hasFeatureAccess: (feature: string) => boolean;
  getCurrentPlan: () => SubscriptionPlan;
  isFeatureUnlocked: (planRequired: PlanType) => boolean;
}

export interface PaywallProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseSuccess?: (customerInfo: CustomerInfo) => void;
  onPurchaseError?: (error: string) => void;
  selectedPlan?: PlanType;
}

export interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  onSelect: (planId: PlanType) => void;
  isLoading?: boolean;
}

export interface FeatureAccessLevel {
  free: string[];
  basic: string[];
  pro: string[];
}

// Constantes para los niveles de acceso de características
export const FEATURE_ACCESS: FeatureAccessLevel = {
  free: [
    'basic_routines',
    'basic_tracking',
    'limited_exercises'
  ],
  basic: [
    'basic_routines',
    'basic_tracking',
    'limited_exercises',
    'custom_routines',
    'advanced_metrics',
    'full_exercise_library',
    'basic_meal_plans'
  ],
  pro: [
    'basic_routines',
    'basic_tracking',
    'limited_exercises',
    'custom_routines',
    'advanced_metrics',
    'full_exercise_library',
    'basic_meal_plans',
    'ai_recommendations',
    'detailed_analytics',
    'premium_meal_plans',
    'priority_support',
    'early_access'
  ]
};

// Eventos de analytics para tracking
export interface SubscriptionAnalyticsEvent {
  event_name: string;
  plan_type?: PlanType;
  price?: number;
  currency?: string;
  error_message?: string;
  user_id?: string;
}

export const SUBSCRIPTION_EVENTS = {
  PAYWALL_OPENED: 'paywall_opened',
  PLAN_SELECTED: 'plan_selected',
  PURCHASE_STARTED: 'purchase_started',
  PURCHASE_COMPLETED: 'purchase_completed',
  PURCHASE_FAILED: 'purchase_failed',
  PURCHASE_CANCELLED: 'purchase_cancelled',
  RESTORE_STARTED: 'restore_started',
  RESTORE_COMPLETED: 'restore_completed',
  RESTORE_FAILED: 'restore_failed',
  SUBSCRIPTION_EXPIRED: 'subscription_expired'
} as const; 