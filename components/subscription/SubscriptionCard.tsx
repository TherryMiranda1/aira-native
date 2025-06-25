import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ColorValue,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SubscriptionCardProps } from '@/types/subscriptions';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export function SubscriptionCard({
  plan,
  isCurrentPlan,
  onSelect,
  isLoading = false,
}: SubscriptionCardProps) {
  const isFreePlan = plan.id === 'free';
  const isPremiumPlan = plan.id === 'pro';

  const handlePress = () => {
    if (!isLoading && !isCurrentPlan) {
      onSelect(plan.id);
    }
  };

  const getCardColors = () => {
    if (isCurrentPlan) {
      return ['#4CAF50', '#45A049'];
    } else if (isPremiumPlan) {
      return ['#FF6B6B', '#FF5252'];
    } else if (plan.id === 'basic') {
      return ['#2196F3', '#1976D2'];
    } else {
      return ['#9E9E9E', '#757575'];
    }
  };

  const getBorderColor = () => {
    if (isCurrentPlan) return '#4CAF50';
    if (isPremiumPlan) return '#FF6B6B';
    if (plan.id === 'basic') return '#2196F3';
    return '#E0E0E0';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: getBorderColor() },
        isCurrentPlan && styles.currentPlanContainer,
        isPremiumPlan && styles.popularContainer,
      ]}
      onPress={handlePress}
      disabled={isLoading || isCurrentPlan}
      activeOpacity={0.8}
    >
      {/* Badge para plan popular */}
      {isPremiumPlan && !isCurrentPlan && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>MÁS POPULAR</Text>
        </View>
      )}

      {/* Badge para plan actual */}
      {isCurrentPlan && (
        <View style={styles.currentPlanBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#fff" />
          <Text style={styles.currentPlanBadgeText}>PLAN ACTUAL</Text>
        </View>
      )}

      <LinearGradient
        colors={getCardColors() as [ColorValue, ColorValue, ...ColorValue[]]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          {isFreePlan ? (
            <Text style={styles.freePrice}>GRATIS</Text>
          ) : (
            <>
              <Text style={styles.currency}>€</Text>
              <Text style={styles.price}>{plan.price.toFixed(2)}</Text>
              <Text style={styles.period}>/mes</Text>
            </>
          )}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={getBorderColor()}
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {!isCurrentPlan && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.selectButton,
                { backgroundColor: getBorderColor() },
                isLoading && styles.loadingButton,
              ]}
              onPress={handlePress}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.buttonText}>Procesando...</Text>
              ) : (
                <Text style={styles.buttonText}>
                  {isFreePlan ? 'CONTINUAR GRATIS' : 'SUSCRIBIRSE'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  currentPlanContainer: {
    borderWidth: 3,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  popularContainer: {
    borderWidth: 3,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 10,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
  currentPlanBadge: {
    position: 'absolute',
    top: -1,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currentPlanBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  planName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  freePrice: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
  currency: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
  price: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
  period: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Montserrat',
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 10,
  },
  selectButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
}); 