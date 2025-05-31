import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { AiraColors, AiraColorsWithAlpha } from '@/constants/Colors';
import { OnboardingData } from '@/app/onboarding';
import { AiraVariants } from '@/constants/Themes';

interface NutritionStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const eatingHabits = [
  'Como fuera con frecuencia',
  'Cocino la mayoría de mis comidas',
  'Suelo saltarme comidas',
  'Como a deshoras',
  'Picoteo entre comidas',
  'Sigo una dieta estructurada'
];

const dietaryPreferences = [
  'Omnívora',
  'Vegetariana',
  'Vegana',
  'Pescetariana',
  'Sin gluten',
  'Sin lácteos',
  'Keto',
  'Paleo'
];

const foodAversions = [
  'Verduras',
  'Frutas',
  'Carnes rojas',
  'Pescado',
  'Lácteos',
  'Alimentos picantes',
  'Comida procesada',
  'Ninguna'
];

const cookingFrequencies = [
  'Casi nunca',
  '1-2 veces por semana',
  '3-4 veces por semana',
  'Casi todos los días'
];

const budgets = [
  'Económico',
  'Moderado',
  'Sin restricciones'
];

export default function NutritionStep({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}: NutritionStepProps) {
  
  const handleEatingHabitToggle = (habit: string) => {
    const newHabits = [...data.eatingHabits];
    
    if (newHabits.includes(habit)) {
      newHabits.splice(newHabits.indexOf(habit), 1);
    } else {
      newHabits.push(habit);
    }
    
    updateData({ eatingHabits: newHabits });
  };

  const handleDietaryPreferenceToggle = (preference: string) => {
    const newPreferences = [...data.dietaryPreferences];
    
    if (newPreferences.includes(preference)) {
      newPreferences.splice(newPreferences.indexOf(preference), 1);
    } else {
      newPreferences.push(preference);
    }
    
    updateData({ dietaryPreferences: newPreferences });
  };

  const handleFoodAversionToggle = (aversion: string) => {
    if (aversion === 'Ninguna') {
      updateData({ foodAversions: data.foodAversions.includes('Ninguna') ? [] : ['Ninguna'] });
    } else {
      const newAversions = [...data.foodAversions];
      
      // Eliminar "Ninguna" si se selecciona otra aversión
      if (newAversions.includes('Ninguna')) {
        newAversions.splice(newAversions.indexOf('Ninguna'), 1);
      }
      
      // Alternar la aversión seleccionada
      if (newAversions.includes(aversion)) {
        newAversions.splice(newAversions.indexOf(aversion), 1);
      } else {
        newAversions.push(aversion);
      }
      
      updateData({ foodAversions: newAversions });
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="nutrition" size={48} color={AiraColors.primary} />
          <ThemedText style={styles.title}>Nutrición</ThemedText>
          <ThemedText style={styles.subtitle}>
            Cuéntame sobre tus hábitos alimenticios para personalizar tu plan
          </ThemedText>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Hábitos alimenticios */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Cuáles son tus hábitos alimenticios actuales? (Selecciona los que apliquen)
            </ThemedText>
            <View style={styles.checkboxGrid}>
              {eatingHabits.map((habit) => (
                <TouchableOpacity
                  key={habit}
                  style={[
                    styles.checkboxOption,
                    data.eatingHabits.includes(habit) && styles.checkboxSelected
                  ]}
                  onPress={() => handleEatingHabitToggle(habit)}
                >
                  <View style={[
                    styles.checkbox,
                    data.eatingHabits.includes(habit) && styles.checkboxChecked
                  ]}>
                    {data.eatingHabits.includes(habit) && (
                      <Ionicons name="checkmark" size={16} color={AiraColors.primary} />
                    )}
                  </View>
                  <ThemedText style={styles.checkboxText}>{habit}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preferencias dietéticas */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Sigues alguna dieta específica? (Selecciona las que apliquen)
            </ThemedText>
            <View style={styles.checkboxGrid}>
              {dietaryPreferences.map((preference) => (
                <TouchableOpacity
                  key={preference}
                  style={[
                    styles.checkboxOption,
                    data.dietaryPreferences.includes(preference) && styles.checkboxSelected
                  ]}
                  onPress={() => handleDietaryPreferenceToggle(preference)}
                >
                  <View style={[
                    styles.checkbox,
                    data.dietaryPreferences.includes(preference) && styles.checkboxChecked
                  ]}>
                    {data.dietaryPreferences.includes(preference) && (
                      <Ionicons name="checkmark" size={16} color={AiraColors.primary} />
                    )}
                  </View>
                  <ThemedText style={styles.checkboxText}>{preference}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Aversiones alimentarias */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Hay alimentos que no te gusten o evites? (Selecciona los que apliquen)
            </ThemedText>
            <View style={styles.checkboxGrid}>
              {foodAversions.map((aversion) => (
                <TouchableOpacity
                  key={aversion}
                  style={[
                    styles.checkboxOption,
                    data.foodAversions.includes(aversion) && styles.checkboxSelected
                  ]}
                  onPress={() => handleFoodAversionToggle(aversion)}
                >
                  <View style={[
                    styles.checkbox,
                    data.foodAversions.includes(aversion) && styles.checkboxChecked
                  ]}>
                    {data.foodAversions.includes(aversion) && (
                      <Ionicons name="checkmark" size={16} color={AiraColors.primary} />
                    )}
                  </View>
                  <ThemedText style={styles.checkboxText}>{aversion}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Frecuencia de cocina */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Con qué frecuencia cocinas en casa?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {cookingFrequencies.map((frequency) => (
                <TouchableOpacity
                  key={frequency}
                  style={[
                    styles.option,
                    data.cookingFrequency === frequency && styles.optionSelected
                  ]}
                  onPress={() => updateData({ cookingFrequency: frequency })}
                >
                  <ThemedText style={[
                    styles.optionText,
                    data.cookingFrequency === frequency && styles.optionTextSelected
                  ]}>
                    {frequency}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Presupuesto */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Cuál es tu presupuesto para alimentación?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {budgets.map((budget) => (
                <TouchableOpacity
                  key={budget}
                  style={[
                    styles.option,
                    data.budget === budget && styles.optionSelected
                  ]}
                  onPress={() => updateData({ budget: budget })}
                >
                  <ThemedText style={[
                    styles.optionText,
                    data.budget === budget && styles.optionTextSelected
                  ]}>
                    {budget}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Botones de navegación */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onPrev}
          >
            <Ionicons name="arrow-back" size={20} color={AiraColors.mutedForeground} />
            <ThemedText style={styles.backButtonText}>Atrás</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.nextButton}
            onPress={onNext}
          >
            <ThemedText style={styles.nextButtonText}>
              Siguiente
            </ThemedText>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
    color: AiraColors.foreground,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.8),
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    color: AiraColors.foreground,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.3),
    backgroundColor: AiraColors.background,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    borderColor: AiraColors.primary,
  },
  optionText: {
    fontSize: 14,
    color: AiraColors.foreground,
  },
  optionTextSelected: {
    color: AiraColors.primary,
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  checkboxSelected: {
    opacity: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 2,
    borderColor: AiraColors.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  checkboxChecked: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.2),
  },
  checkboxText: {
    fontSize: 14,
    color: AiraColors.foreground,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    marginLeft: 4,
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  nextButton: {
    backgroundColor: AiraColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: AiraVariants.tagRadius,
  },
  nextButtonText: {
    color: AiraColors.background,
    fontSize: 16,
    marginRight: 8,
  },
});
