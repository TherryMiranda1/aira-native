import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { PurchasesPackage } from 'react-native-purchases';
import { useSubscription } from '@/context/SubscriptionContext';
import { SubscriptionCard } from './SubscriptionCard';
import { PaywallProps, PlanType } from '@/types/subscriptions';
import { REVENUECAT_CONFIG } from '@/constants/Config';
import { Colors } from '@/constants/Colors';

const { height } = Dimensions.get('window');

export function Paywall({
  visible,
  onClose,
  onPurchaseSuccess,
  onPurchaseError,
  selectedPlan,
}: PaywallProps) {
  const {
    subscriptionState,
    purchasePackage,
    restorePurchases,
  } = useSubscription();

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanType>(selectedPlan || 'basic');

  useEffect(() => {
    if (selectedPlan) {
      setSelectedPlanId(selectedPlan);
    }
  }, [selectedPlan]);

  const plans = [
    { ...REVENUECAT_CONFIG.PLANS.FREE, id: 'free' as PlanType },
    { ...REVENUECAT_CONFIG.PLANS.BASIC, id: 'basic' as PlanType },
    { ...REVENUECAT_CONFIG.PLANS.PRO, id: 'pro' as PlanType },
  ];

  const handlePlanSelect = (planId: PlanType) => {
    if (planId === 'free') {
      onClose();
      return;
    }
    setSelectedPlanId(planId);
  };

  const handlePurchase = async (planId: PlanType) => {
    if (planId === 'free') {
      onClose();
      return;
    }

    try {
      setIsProcessing(true);

      // Encontrar el package correspondiente al plan seleccionado
      const targetProductId = planId === 'pro' 
        ? REVENUECAT_CONFIG.PRODUCT_IDS.PRO_MONTHLY 
        : REVENUECAT_CONFIG.PRODUCT_IDS.BASIC_MONTHLY;

      let targetPackage: PurchasesPackage | null = null;

      // Buscar el package en las ofertas disponibles
      if (subscriptionState.offerings) {
        for (const offering of subscriptionState.offerings) {
          const foundPackage = offering.availablePackages.find(
            pkg => pkg.product.identifier === targetProductId
          );
          if (foundPackage) {
            targetPackage = foundPackage;
            break;
          }
        }
      }

      if (!targetPackage) {
        throw new Error('Producto no disponible. Por favor, intenta más tarde.');
      }

      const result = await purchasePackage(targetPackage);

      if (result.success) {
        Alert.alert(
          '¡Suscripción Exitosa!',
          `Te has suscrito al ${planId === 'pro' ? 'Plan Pro' : 'Plan Básico'}. ¡Disfruta de todas las funciones premium!`,
          [
            {
              text: 'Continuar',
              onPress: () => {
                onPurchaseSuccess?.(result.customerInfo!);
                onClose();
              },
            },
          ]
        );
      } else {
        throw new Error(result.error || 'Error en la compra');
      }

    } catch (error) {
      console.error('Error en compra:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      Alert.alert(
        'Error en la Compra',
        errorMessage,
        [{ text: 'Entendido' }]
      );
      
      onPurchaseError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setIsProcessing(true);
      
      const result = await restorePurchases();
      
      if (result.success) {
        Alert.alert(
          'Compras Restauradas',
          'Se han restaurado tus compras exitosamente.',
          [
            {
              text: 'Continuar',
              onPress: () => {
                onPurchaseSuccess?.(result.customerInfo!);
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Sin Compras Previas',
          'No se encontraron compras previas para restaurar.',
          [{ text: 'Entendido' }]
        );
      }
    } catch (error) {
      console.error('Error restaurando compras:', error);
      Alert.alert(
        'Error',
        'No se pudieron restaurar las compras. Intenta de nuevo más tarde.',
        [{ text: 'Entendido' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (subscriptionState.isLoading) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.loadingContainer}>
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Cargando planes...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        
        <View style={styles.content}>
          {/* Header */}
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={isProcessing}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.title}>Desbloquea Todo el Potencial de Aira</Text>
              <Text style={styles.subtitle}>
                Elige el plan perfecto para alcanzar tus objetivos de bienestar
              </Text>
            </View>
          </LinearGradient>

          {/* Plans */}
          <ScrollView
            style={styles.plansContainer}
            contentContainerStyle={styles.plansContent}
            showsVerticalScrollIndicator={false}
          >
            {plans.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={subscriptionState.currentPlan === plan.id}
                onSelect={handlePurchase}
                isLoading={isProcessing}
              />
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestorePurchases}
              disabled={isProcessing}
            >
              <Text style={styles.restoreButtonText}>
                Restaurar Compras
              </Text>
            </TouchableOpacity>
            
            <View style={styles.legalContainer}>
              <Text style={styles.legalText}>
                Al continuar, aceptas nuestros términos de servicio y política de privacidad.
                Las suscripciones se renuevan automáticamente.
              </Text>
            </View>
          </View>
        </View>

        {/* Loading Overlay */}
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <BlurView intensity={40} style={StyleSheet.absoluteFill} />
            <View style={styles.processingContent}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.processingText}>Procesando...</Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Montserrat',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'MontserratBold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    opacity: 0.9,
    lineHeight: 22,
  },
  plansContainer: {
    flex: 1,
  },
  plansContent: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  restoreButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontFamily: 'Montserrat',
    textDecorationLine: 'underline',
  },
  legalContainer: {
    alignItems: 'center',
  },
  legalText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    fontFamily: 'Montserrat',
    lineHeight: 16,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingContent: {
    alignItems: 'center',
  },
  processingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#fff',
    fontFamily: 'MontserratBold',
  },
}); 