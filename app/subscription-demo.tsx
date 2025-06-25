import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSubscription } from '@/context/SubscriptionContext';
import { usePaywall, usePremiumFeature } from '@/hooks/usePaywall';
import { Paywall } from '@/components/subscription/Paywall';
import { Colors } from '@/constants/Colors';

export default function SubscriptionDemo() {
  const router = useRouter();
  const { subscriptionState } = useSubscription();
  
  const {
    isPaywallVisible,
    selectedPlan,
    showPaywall,
    hidePaywall,
    handlePurchaseSuccess,
    handlePurchaseError,
  } = usePaywall({
    onPurchaseSuccess: (customerInfo) => {
      Alert.alert(
        '¡Éxito!',
        'Tu suscripción se ha activado correctamente.',
        [{ text: 'Genial!' }]
      );
    },
    onPurchaseError: (error) => {
      Alert.alert(
        'Error',
        `Hubo un problema con tu suscripción: ${error}`,
        [{ text: 'Entendido' }]
      );
    },
  });

  // Hooks para características específicas
  const basicFeature = usePremiumFeature('basic');
  const proFeature = usePremiumFeature('pro');

  const features = [
    {
      id: 'ai_recommendations',
      title: 'Recomendaciones IA',
      description: 'Obtén sugerencias personalizadas basadas en IA',
      icon: 'bulb-outline',
      requiredPlan: 'pro' as const,
      color: '#FF6B6B',
    },
    {
      id: 'advanced_analytics',
      title: 'Análisis Avanzado',
      description: 'Métricas detalladas de tu progreso',
      icon: 'analytics-outline',
      requiredPlan: 'basic' as const,
      color: '#2196F3',
    },
    {
      id: 'premium_workouts',
      title: 'Rutinas Premium',
      description: 'Acceso a rutinas exclusivas y avanzadas',
      icon: 'fitness-outline',
      requiredPlan: 'basic' as const,
      color: '#4CAF50',
    },
    {
      id: 'priority_support',
      title: 'Soporte Prioritario',
      description: 'Asistencia personalizada y respuesta rápida',
      icon: 'headset-outline',
      requiredPlan: 'pro' as const,
      color: '#9C27B0',
    },
  ];

  const handleFeaturePress = (feature: typeof features[0]) => {
    if (feature.requiredPlan === 'basic') {
      basicFeature.executeWithAccess(() => {
        Alert.alert(
          'Característica Desbloqueada',
          `¡Tienes acceso a ${feature.title}!`,
          [{ text: 'Genial!' }]
        );
      });
    } else {
      proFeature.executeWithAccess(() => {
        Alert.alert(
          'Característica Desbloqueada',
          `¡Tienes acceso a ${feature.title}!`,
          [{ text: 'Genial!' }]
        );
      });
    }
  };

  const getPlanBadgeColor = () => {
    switch (subscriptionState.currentPlan) {
      case 'pro':
        return '#FF6B6B';
      case 'basic':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const getPlanDisplayName = () => {
    switch (subscriptionState.currentPlan) {
      case 'pro':
        return 'Plan Pro';
      case 'basic':
        return 'Plan Básico';
      default:
        return 'Plan Gratuito';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.title}>Demo de Suscripciones</Text>
          
          <View style={[styles.planBadge, { backgroundColor: getPlanBadgeColor() }]}>
            <Text style={styles.planBadgeText}>{getPlanDisplayName()}</Text>
          </View>
        </View>

        {/* Current Plan Info */}
        <View style={styles.currentPlanCard}>
          <LinearGradient
            colors={[getPlanBadgeColor(), getPlanBadgeColor() + '80']}
            style={styles.currentPlanGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.currentPlanContent}>
              <Ionicons 
                name={subscriptionState.hasActiveSubscription ? "star" : "star-outline"} 
                size={32} 
                color="#fff" 
              />
              <Text style={styles.currentPlanTitle}>{getPlanDisplayName()}</Text>
              <Text style={styles.currentPlanSubtitle}>
                {subscriptionState.hasActiveSubscription 
                  ? 'Suscripción activa' 
                  : 'Plan gratuito activo'
                }
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
            onPress={() => showPaywall('basic')}
          >
            <Ionicons name="card-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Ver Plan Básico</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF6B6B' }]}
            onPress={() => showPaywall('pro')}
          >
            <Ionicons name="diamond-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Ver Plan Pro</Text>
          </TouchableOpacity>
        </View>

        {/* Features Demo */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Prueba las Características</Text>
          <Text style={styles.sectionSubtitle}>
            Toca cualquier característica para probar el sistema de suscripciones
          </Text>
          
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              onPress={() => handleFeaturePress(feature)}
            >
              <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                <Ionicons name={feature.icon as any} size={24} color="#fff" />
              </View>
              
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
                <View style={styles.featureRequirement}>
                  <Text style={[styles.requirementText, { color: feature.color }]}>
                    Requiere {feature.requiredPlan === 'basic' ? 'Plan Básico' : 'Plan Pro'}
                  </Text>
                </View>
              </View>
              
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={Colors.light.tabIconDefault} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Debug Info */}
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>Debug Info</Text>
            <Text style={styles.debugText}>
              Plan actual: {subscriptionState.currentPlan}
            </Text>
            <Text style={styles.debugText}>
              Suscripción activa: {subscriptionState.hasActiveSubscription ? 'Sí' : 'No'}
            </Text>
            <Text style={styles.debugText}>
              Cargando: {subscriptionState.isLoading ? 'Sí' : 'No'}
            </Text>
            {subscriptionState.error && (
              <Text style={[styles.debugText, { color: '#FF6B6B' }]}>
                Error: {subscriptionState.error}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Paywall Modal */}
      <Paywall
        visible={isPaywallVisible}
        onClose={hidePaywall}
        onPurchaseSuccess={handlePurchaseSuccess}
        onPurchaseError={handlePurchaseError}
        selectedPlan={selectedPlan}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#667eea',
    padding: 20,
    borderRadius: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'MontserratBold',
  },
  planBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  planBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
  currentPlanCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  currentPlanGradient: {
    padding: 24,
  },
  currentPlanContent: {
    alignItems: 'center',
  },
  currentPlanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'MontserratBold',
    marginTop: 8,
  },
  currentPlanSubtitle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Montserrat',
    opacity: 0.9,
    marginTop: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
  featuresContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'MontserratBold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Montserrat',
    marginBottom: 20,
    lineHeight: 22,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'MontserratBold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Montserrat',
    marginBottom: 8,
    lineHeight: 18,
  },
  featureRequirement: {
    alignSelf: 'flex-start',
  },
  requirementText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
  debugContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'MontserratBold',
  },
  debugText: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    marginBottom: 4,
  },
}); 