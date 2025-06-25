import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { useUser } from '@clerk/clerk-expo';
import subscriptionService from '@/services/api/subscription.service';
import { REVENUECAT_CONFIG } from '@/constants/Config';
import {
    SubscriptionContextType,
    SubscriptionState,
    PurchaseResult,
    PlanType,
    SubscriptionPlan,
    FEATURE_ACCESS
} from '@/types/subscriptions';

// Estado inicial
const initialState: SubscriptionState = {
  isLoading: true,
  hasActiveSubscription: false,
  currentPlan: 'free',
  customerInfo: null,
  offerings: null,
  error: null,
};

// Tipos de acciones para el reducer
type SubscriptionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CUSTOMER_INFO'; payload: CustomerInfo }
  | { type: 'SET_OFFERINGS'; payload: PurchasesOffering[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_PLAN'; payload: PlanType }
  | { type: 'SET_ACTIVE_SUBSCRIPTION'; payload: boolean }
  | { type: 'RESET_STATE' };

// Reducer para manejar el estado
function subscriptionReducer(state: SubscriptionState, action: SubscriptionAction): SubscriptionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_CUSTOMER_INFO':
      return { ...state, customerInfo: action.payload };
    
    case 'SET_OFFERINGS':
      return { ...state, offerings: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_CURRENT_PLAN':
      return { ...state, currentPlan: action.payload };
    
    case 'SET_ACTIVE_SUBSCRIPTION':
      return { ...state, hasActiveSubscription: action.payload };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Crear el contexto
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Props del provider
interface SubscriptionProviderProps {
  children: ReactNode;
}

// Provider del contexto
export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);
  const { user } = useUser();

  // Inicializar RevenueCat cuando el componente se monta
  useEffect(() => {
    initializeRevenueCat();
  }, []);

  // Sincronizar con el usuario de Clerk cuando cambie
  useEffect(() => {
    if (user?.id && subscriptionService.isRevenueCatInitialized()) {
      handleUserLogin(user.id);
    }
  }, [user?.id]);

  // Configurar listener para actualizaciones de CustomerInfo
  useEffect(() => {
    subscriptionService.setCustomerInfoUpdateListener(handleCustomerInfoUpdate);
    
    return () => {
      subscriptionService.cleanup();
    };
  }, []);

  /**
   * Inicializa RevenueCat
   */
  const initializeRevenueCat = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      await subscriptionService.initialize();
      await checkSubscriptionStatus();
      await getOfferings();

    } catch (error) {
      console.error('Error inicializando RevenueCat:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error inicializando el sistema de suscripciones' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  /**
   * Maneja el login del usuario
   */
  const handleUserLogin = async (userId: string): Promise<void> => {
    try {
      const customerInfo = await subscriptionService.loginUser(userId);
      handleCustomerInfoUpdate(customerInfo);
    } catch (error) {
      console.error('Error en login de usuario:', error);
    }
  };

  /**
   * Maneja las actualizaciones de CustomerInfo
   */
  const handleCustomerInfoUpdate = (customerInfo: CustomerInfo): void => {
    dispatch({ type: 'SET_CUSTOMER_INFO', payload: customerInfo });
    
    // Actualizar plan actual
    const currentPlan = getCurrentPlanFromCustomerInfo(customerInfo);
    dispatch({ type: 'SET_CURRENT_PLAN', payload: currentPlan });
    
    // Actualizar estado de suscripción activa
    const hasActiveSubscription = Object.keys(customerInfo.entitlements.active).length > 0;
    dispatch({ type: 'SET_ACTIVE_SUBSCRIPTION', payload: hasActiveSubscription });
  };

  /**
   * Obtiene el plan actual desde CustomerInfo
   */
  const getCurrentPlanFromCustomerInfo = (customerInfo: CustomerInfo): PlanType => {
    if (customerInfo.entitlements.active[REVENUECAT_CONFIG.ENTITLEMENTS.PRO]) {
      return 'pro';
    } else if (customerInfo.entitlements.active[REVENUECAT_CONFIG.ENTITLEMENTS.BASIC]) {
      return 'basic';
    } else {
      return 'free';
    }
  };

  /**
   * Verifica el estado de la suscripción
   */
  const checkSubscriptionStatus = async (): Promise<void> => {
    try {
      const customerInfo = await subscriptionService.getCustomerInfo();
      handleCustomerInfoUpdate(customerInfo);
    } catch (error) {
      console.error('Error verificando estado de suscripción:', error);
    }
  };

  /**
   * Obtiene las ofertas disponibles
   */
  const getOfferings = async (): Promise<PurchasesOffering[] | null> => {
    try {
      const offerings = await subscriptionService.getOfferings();
      dispatch({ type: 'SET_OFFERINGS', payload: offerings });
      return offerings;
    } catch (error) {
      console.error('Error obteniendo ofertas:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error obteniendo ofertas disponibles' });
      return null;
    }
  };

  /**
   * Realiza una compra
   */
  const purchasePackage = async (packageToPurchase: PurchasesPackage): Promise<PurchaseResult> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const result = await subscriptionService.purchasePackage(packageToPurchase);
      
      if (result.success && result.customerInfo) {
        handleCustomerInfoUpdate(result.customerInfo);
      }

      return result;

    } catch (error) {
      console.error('Error en compra:', error);
      return {
        success: false,
        error: 'Error procesando la compra'
      };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  /**
   * Restaura las compras
   */
  const restorePurchases = async (): Promise<PurchaseResult> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const result = await subscriptionService.restorePurchases();
      
      if (result.success && result.customerInfo) {
        handleCustomerInfoUpdate(result.customerInfo);
      }

      return result;

    } catch (error) {
      console.error('Error restaurando compras:', error);
      return {
        success: false,
        error: 'Error restaurando las compras'
      };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  /**
   * Verifica si el usuario tiene acceso a una característica específica
   */
  const hasFeatureAccess = (feature: string): boolean => {
    const currentPlanFeatures = FEATURE_ACCESS[state.currentPlan];
    return currentPlanFeatures.includes(feature);
  };

  /**
   * Obtiene la información del plan actual
   */
  const getCurrentPlan = (): SubscriptionPlan => {
    const planConfig = REVENUECAT_CONFIG.PLANS[state.currentPlan.toUpperCase() as keyof typeof REVENUECAT_CONFIG.PLANS];
    return {
      ...planConfig,
      id: state.currentPlan // Usar el currentPlan que ya es de tipo PlanType
    };
  };

  /**
   * Verifica si una característica está desbloqueada para el plan requerido
   */
  const isFeatureUnlocked = (planRequired: PlanType): boolean => {
    const planHierarchy: Record<PlanType, number> = {
      free: 0,
      basic: 1,
      pro: 2
    };

    return planHierarchy[state.currentPlan] >= planHierarchy[planRequired];
  };

  // Valor del contexto
  const contextValue: SubscriptionContextType = {
    subscriptionState: state,
    initializeRevenueCat,
    purchasePackage,
    restorePurchases,
    getOfferings,
    checkSubscriptionStatus,
    hasFeatureAccess,
    getCurrentPlan,
    isFeatureUnlocked,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// Hook para usar el contexto
export function useSubscription(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  
  if (context === undefined) {
    throw new Error('useSubscription debe ser usado dentro de un SubscriptionProvider');
  }
  
  return context;
}

// Hook para verificar acceso a características
export function useFeatureAccess(feature: string): boolean {
  const { hasFeatureAccess } = useSubscription();
  return hasFeatureAccess(feature);
}

// Hook para obtener el plan actual
export function useCurrentPlan(): SubscriptionPlan {
  const { getCurrentPlan } = useSubscription();
  return getCurrentPlan();
}

// Hook para verificar si una característica está desbloqueada
export function useFeatureUnlocked(planRequired: PlanType): boolean {
  const { isFeatureUnlocked } = useSubscription();
  return isFeatureUnlocked(planRequired);
} 