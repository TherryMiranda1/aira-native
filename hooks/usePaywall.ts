import { useState, useCallback } from 'react';
import { CustomerInfo } from 'react-native-purchases';
import { useSubscription } from '@/context/SubscriptionContext';
import { PlanType } from '@/types/subscriptions';

interface UsePaywallOptions {
  requiredPlan?: PlanType;
  onPurchaseSuccess?: (customerInfo: CustomerInfo) => void;
  onPurchaseError?: (error: string) => void;
  onClose?: () => void;
}

export function usePaywall(options: UsePaywallOptions = {}) {
  const {
    requiredPlan = 'basic',
    onPurchaseSuccess,
    onPurchaseError,
    onClose,
  } = options;

  const { subscriptionState, isFeatureUnlocked } = useSubscription();
  const [isPaywallVisible, setIsPaywallVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(requiredPlan);

  /**
   * Muestra el paywall
   */
  const showPaywall = useCallback((planType?: PlanType) => {
    if (planType) {
      setSelectedPlan(planType);
    }
    setIsPaywallVisible(true);
  }, []);

  /**
   * Oculta el paywall
   */
  const hidePaywall = useCallback(() => {
    setIsPaywallVisible(false);
    onClose?.();
  }, [onClose]);

  /**
   * Muestra el paywall solo si es necesario (el usuario no tiene el plan requerido)
   */
  const showPaywallIfNeeded = useCallback((planType: PlanType = requiredPlan) => {
    if (!isFeatureUnlocked(planType)) {
      showPaywall(planType);
      return true;
    }
    return false;
  }, [isFeatureUnlocked, requiredPlan, showPaywall]);

  /**
   * Verifica si se debe mostrar el paywall para una característica específica
   */
  const shouldShowPaywallForFeature = useCallback((planType: PlanType) => {
    return !isFeatureUnlocked(planType);
  }, [isFeatureUnlocked]);

  /**
   * Maneja el éxito de la compra
   */
  const handlePurchaseSuccess = useCallback((customerInfo: CustomerInfo) => {
    onPurchaseSuccess?.(customerInfo);
    hidePaywall();
  }, [onPurchaseSuccess, hidePaywall]);

  /**
   * Maneja el error de la compra
   */
  const handlePurchaseError = useCallback((error: string) => {
    onPurchaseError?.(error);
    // No cerramos el paywall automáticamente en caso de error
    // para que el usuario pueda intentar de nuevo
  }, [onPurchaseError]);

  /**
   * Verifica si el usuario tiene acceso premium
   */
  const hasPremiumAccess = subscriptionState.hasActiveSubscription;

  /**
   * Obtiene el plan actual del usuario
   */
  const currentPlan = subscriptionState.currentPlan;

  /**
   * Verifica si el paywall está cargando
   */
  const isLoading = subscriptionState.isLoading;

  /**
   * Obtiene el error actual si existe
   */
  const error = subscriptionState.error;

  return {
    // Estado
    isPaywallVisible,
    selectedPlan,
    hasPremiumAccess,
    currentPlan,
    isLoading,
    error,
    
    // Acciones
    showPaywall,
    hidePaywall,
    showPaywallIfNeeded,
    shouldShowPaywallForFeature,
    
    // Handlers para el componente Paywall
    handlePurchaseSuccess,
    handlePurchaseError,
    
    // Utilidades
    isFeatureUnlocked,
  };
}

// Hook específico para verificar acceso a características premium
export function usePremiumFeature(requiredPlan: PlanType = 'basic') {
  const { isFeatureUnlocked } = useSubscription();
  const { showPaywallIfNeeded } = usePaywall({ requiredPlan });

  /**
   * Verifica el acceso y muestra el paywall si es necesario
   */
  const checkAccess = useCallback(() => {
    return showPaywallIfNeeded(requiredPlan);
  }, [showPaywallIfNeeded, requiredPlan]);

  /**
   * Ejecuta una acción solo si el usuario tiene acceso
   */
  const executeWithAccess = useCallback((action: () => void) => {
    if (isFeatureUnlocked(requiredPlan)) {
      action();
      return true;
    } else {
      showPaywallIfNeeded(requiredPlan);
      return false;
    }
  }, [isFeatureUnlocked, requiredPlan, showPaywallIfNeeded]);

  return {
    hasAccess: isFeatureUnlocked(requiredPlan),
    checkAccess,
    executeWithAccess,
  };
}

// Hook para manejar límites de uso en el plan gratuito
export function useFreeTrialLimits() {
  const { subscriptionState } = useSubscription();
  const { showPaywall } = usePaywall();

  /**
   * Verifica si se ha alcanzado un límite y muestra el paywall
   */
  const checkLimit = useCallback((
    currentUsage: number,
    limit: number,
    featureName: string
  ) => {
    if (subscriptionState.currentPlan === 'free' && currentUsage >= limit) {
      showPaywall('basic');
      return false;
    }
    return true;
  }, [subscriptionState.currentPlan, showPaywall]);

  /**
   * Obtiene el porcentaje de uso de una característica
   */
  const getUsagePercentage = useCallback((
    currentUsage: number,
    limit: number
  ) => {
    if (subscriptionState.currentPlan !== 'free') {
      return 0; // Sin límites en planes premium
    }
    return Math.min((currentUsage / limit) * 100, 100);
  }, [subscriptionState.currentPlan]);

  /**
   * Verifica si está cerca del límite (80% o más)
   */
  const isNearLimit = useCallback((
    currentUsage: number,
    limit: number
  ) => {
    return getUsagePercentage(currentUsage, limit) >= 80;
  }, [getUsagePercentage]);

  return {
    checkLimit,
    getUsagePercentage,
    isNearLimit,
    isFreePlan: subscriptionState.currentPlan === 'free',
  };
} 