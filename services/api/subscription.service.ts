import { Platform } from 'react-native';
import Purchases, {
    CustomerInfo,
    PurchasesOffering,
    PurchasesPackage,
    LOG_LEVEL,
    PurchasesError,
    PURCHASES_ERROR_CODE
} from 'react-native-purchases';
import { REVENUECAT_CONFIG } from '@/constants/Config';
import { PurchaseResult, PlanType, SubscriptionAnalyticsEvent } from '@/types/subscriptions';

class SubscriptionService {
  private isInitialized = false;
  private customerInfoUpdateListener: ((customerInfo: CustomerInfo) => void) | null = null;

  /**
   * Inicializa RevenueCat SDK
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        console.log('RevenueCat ya está inicializado');
        return;
      }

      // Configurar nivel de logs (solo en desarrollo)
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Obtener la API key correcta según la plataforma
      const apiKey = this.getApiKeyForPlatform();
      
      if (!apiKey) {
        throw new Error('API key de RevenueCat no configurada para esta plataforma');
      }

      // Configurar RevenueCat
      await Purchases.configure({ apiKey });

      this.isInitialized = true;
      console.log('RevenueCat inicializado correctamente');

      // Configurar listener para actualizaciones de CustomerInfo
      this.setupCustomerInfoUpdateListener();

    } catch (error) {
      console.error('Error inicializando RevenueCat:', error);
      throw error;
    }
  }

  /**
   * Obtiene la API key correcta según la plataforma
   */
  private getApiKeyForPlatform(): string | null {
    switch (Platform.OS) {
      case 'ios':
        return REVENUECAT_CONFIG.API_KEYS.IOS;
      case 'android':
        return REVENUECAT_CONFIG.API_KEYS.ANDROID;
      default:
        return null;
    }
  }

  /**
   * Configura el listener para actualizaciones de CustomerInfo
   */
  private setupCustomerInfoUpdateListener(): void {
    Purchases.addCustomerInfoUpdateListener((customerInfo: CustomerInfo) => {
      console.log('CustomerInfo actualizado:', customerInfo);
      if (this.customerInfoUpdateListener) {
        this.customerInfoUpdateListener(customerInfo);
      }
    });
  }

  /**
   * Establece un listener para actualizaciones de CustomerInfo
   */
  setCustomerInfoUpdateListener(listener: (customerInfo: CustomerInfo) => void): void {
    this.customerInfoUpdateListener = listener;
  }

  /**
   * Obtiene la información del cliente actual
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Error obteniendo CustomerInfo:', error);
      throw error;
    }
  }

  /**
   * Obtiene las ofertas disponibles
   */
  async getOfferings(): Promise<PurchasesOffering[]> {
    try {
      const offerings = await Purchases.getOfferings();
      return Object.values(offerings.all);
    } catch (error) {
      console.error('Error obteniendo ofertas:', error);
      throw error;
    }
  }

  /**
   * Realiza una compra
   */
  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<PurchaseResult> {
    try {
      console.log('Iniciando compra:', packageToPurchase.identifier);
      
      // Tracking de analytics
      this.trackEvent({
        event_name: 'purchase_started',
        plan_type: this.getPlanTypeFromPackage(packageToPurchase)
      });

      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      
      console.log('Compra completada exitosamente');
      
      // Tracking de analytics
      this.trackEvent({
        event_name: 'purchase_completed',
        plan_type: this.getPlanTypeFromPackage(packageToPurchase)
      });

      return {
        success: true,
        customerInfo
      };

    } catch (error) {
      console.error('Error en la compra:', error);
      
      const purchaseError = error as PurchasesError;
      let errorMessage = 'Error desconocido en la compra';

      // Manejar diferentes tipos de errores
      switch (purchaseError.code) {
        case PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR:
          errorMessage = 'Compra cancelada por el usuario';
          this.trackEvent({
            event_name: 'purchase_cancelled',
            plan_type: this.getPlanTypeFromPackage(packageToPurchase)
          });
          break;
        case PURCHASES_ERROR_CODE.STORE_PROBLEM_ERROR:
          errorMessage = 'Problema con la tienda. Intenta de nuevo más tarde';
          break;
        case PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR:
          errorMessage = 'Las compras no están permitidas en este dispositivo';
          break;
        case PURCHASES_ERROR_CODE.PURCHASE_INVALID_ERROR:
          errorMessage = 'Producto no válido';
          break;
        case PURCHASES_ERROR_CODE.PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR:
          errorMessage = 'Producto no disponible';
          break;
        default:
          errorMessage = purchaseError.message || errorMessage;
      }

      // Tracking de analytics
      this.trackEvent({
        event_name: 'purchase_failed',
        plan_type: this.getPlanTypeFromPackage(packageToPurchase),
        error_message: errorMessage
      });

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Restaura las compras
   */
  async restorePurchases(): Promise<PurchaseResult> {
    try {
      console.log('Iniciando restauración de compras');
      
      // Tracking de analytics
      this.trackEvent({
        event_name: 'restore_started'
      });

      const customerInfo = await Purchases.restorePurchases();
      
      console.log('Compras restauradas exitosamente');
      
      // Tracking de analytics
      this.trackEvent({
        event_name: 'restore_completed'
      });

      return {
        success: true,
        customerInfo
      };

    } catch (error) {
      console.error('Error restaurando compras:', error);
      
      const errorMessage = 'Error al restaurar las compras. Intenta de nuevo más tarde';
      
      // Tracking de analytics
      this.trackEvent({
        event_name: 'restore_failed',
        error_message: errorMessage
      });

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Verifica si el usuario tiene acceso a un entitlement específico
   */
  async hasEntitlementAccess(entitlementId: string): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return customerInfo.entitlements.active[entitlementId] !== undefined;
    } catch (error) {
      console.error('Error verificando entitlement:', error);
      return false;
    }
  }

  /**
   * Obtiene el plan actual del usuario
   */
  async getCurrentPlan(): Promise<PlanType> {
    try {
      const customerInfo = await this.getCustomerInfo();
      
      // Verificar entitlements activos
      if (customerInfo.entitlements.active[REVENUECAT_CONFIG.ENTITLEMENTS.PRO]) {
        return 'pro';
      } else if (customerInfo.entitlements.active[REVENUECAT_CONFIG.ENTITLEMENTS.BASIC]) {
        return 'basic';
      } else {
        return 'free';
      }
    } catch (error) {
      console.error('Error obteniendo plan actual:', error);
      return 'free';
    }
  }

  /**
   * Verifica si el usuario tiene una suscripción activa
   */
  async hasActiveSubscription(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return Object.keys(customerInfo.entitlements.active).length > 0;
    } catch (error) {
      console.error('Error verificando suscripción activa:', error);
      return false;
    }
  }

  /**
   * Login con un ID de usuario específico
   */
  async loginUser(userId: string): Promise<CustomerInfo> {
    try {
      const { customerInfo } = await Purchases.logIn(userId);
      return customerInfo;
    } catch (error) {
      console.error('Error en login de usuario:', error);
      throw error;
    }
  }

  /**
   * Logout del usuario actual
   */
  async logoutUser(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.logOut();
      return customerInfo;
    } catch (error) {
      console.error('Error en logout de usuario:', error);
      throw error;
    }
  }

  /**
   * Obtiene el tipo de plan desde un package
   */
  private getPlanTypeFromPackage(packageToPurchase: PurchasesPackage): PlanType {
    const productId = packageToPurchase.product.identifier;
    
    if (productId === REVENUECAT_CONFIG.PRODUCT_IDS.PRO_MONTHLY) {
      return 'pro';
    } else if (productId === REVENUECAT_CONFIG.PRODUCT_IDS.BASIC_MONTHLY) {
      return 'basic';
    } else {
      return 'free';
    }
  }

  /**
   * Tracking de eventos de analytics
   */
  private trackEvent(event: SubscriptionAnalyticsEvent): void {
    // Aquí puedes integrar con tu servicio de analytics preferido
    // Por ejemplo: Firebase Analytics, Mixpanel, etc.
    console.log('Subscription Analytics Event:', event);
    
    // Ejemplo de integración con un servicio de analytics
    // AnalyticsService.track(event.event_name, event);
  }

  /**
   * Verifica si RevenueCat está inicializado
   */
  isRevenueCatInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Limpia los recursos
   */
  cleanup(): void {
    this.customerInfoUpdateListener = null;
  }
}

// Exportar instancia singleton
export const subscriptionService = new SubscriptionService();
export default subscriptionService; 