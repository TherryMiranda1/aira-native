import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { AiraColors, AiraColorsWithAlpha } from '@/constants/Colors';
import { OnboardingData } from '@/app/onboarding';
import { AiraVariants } from '@/constants/Themes';

interface GoalsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const primaryGoals = [
  'Perder peso',
  'Tonificar mi cuerpo',
  'Ganar masa muscular',
  'Mejorar mi salud general',
  'Aumentar mi energía',
  'Reducir el estrés'
];

const timelines = [
  'Menos de 1 mes',
  '1-3 meses',
  '3-6 meses',
  '6-12 meses',
  'Más de 1 año'
];

const commitments = [
  'Principiante (1-2 días/semana)',
  'Intermedio (3-4 días/semana)',
  'Avanzado (5+ días/semana)'
];

const priorities = [
  'Nutrición balanceada',
  'Ejercicio regular',
  'Descanso adecuado',
  'Reducción de estrés',
  'Hidratación',
  'Consistencia',
  'Flexibilidad en la rutina'
];

export default function GoalsStep({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}: GoalsStepProps) {
  
  const handlePriorityToggle = (priority: string) => {
    const newPriorities = [...data.priorities];
    
    if (newPriorities.includes(priority)) {
      newPriorities.splice(newPriorities.indexOf(priority), 1);
    } else {
      newPriorities.push(priority);
    }
    
    updateData({ priorities: newPriorities });
  };

  const isValid = data.primaryGoal && data.timeline && data.commitment;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="flag" size={48} color={AiraColors.primary} />
          <ThemedText style={styles.title}>Tus objetivos</ThemedText>
          <ThemedText style={styles.subtitle}>
            Cuéntame qué quieres lograr y cómo puedo ayudarte
          </ThemedText>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Objetivo principal */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Cuál es tu objetivo principal?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {primaryGoals.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.option,
                    data.primaryGoal === goal && styles.optionSelected
                  ]}
                  onPress={() => updateData({ primaryGoal: goal })}
                >
                  <ThemedText style={[
                    styles.optionText,
                    data.primaryGoal === goal && styles.optionTextSelected
                  ]}>
                    {goal}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Plazo */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿En qué plazo te gustaría alcanzar tu objetivo?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {timelines.map((timeline) => (
                <TouchableOpacity
                  key={timeline}
                  style={[
                    styles.option,
                    data.timeline === timeline && styles.optionSelected
                  ]}
                  onPress={() => updateData({ timeline: timeline })}
                >
                  <ThemedText style={[
                    styles.optionText,
                    data.timeline === timeline && styles.optionTextSelected
                  ]}>
                    {timeline}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Compromiso */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Cuál es tu nivel de compromiso?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {commitments.map((commitment) => (
                <TouchableOpacity
                  key={commitment}
                  style={[
                    styles.option,
                    data.commitment === commitment && styles.optionSelected
                  ]}
                  onPress={() => updateData({ commitment: commitment })}
                >
                  <ThemedText style={[
                    styles.optionText,
                    data.commitment === commitment && styles.optionTextSelected
                  ]}>
                    {commitment}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Prioridades */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Qué aspectos son más importantes para ti? (Selecciona hasta 3)
            </ThemedText>
            <View style={styles.checkboxGrid}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.checkboxOption,
                    data.priorities.includes(priority) && styles.checkboxSelected,
                    data.priorities.length >= 3 && !data.priorities.includes(priority) && styles.checkboxDisabled
                  ]}
                  onPress={() => {
                    if (data.priorities.includes(priority) || data.priorities.length < 3) {
                      handlePriorityToggle(priority);
                    }
                  }}
                >
                  <View style={[
                    styles.checkbox,
                    data.priorities.includes(priority) && styles.checkboxChecked,
                    data.priorities.length >= 3 && !data.priorities.includes(priority) && styles.checkboxDisabled
                  ]}>
                    {data.priorities.includes(priority) && (
                      <Ionicons name="checkmark" size={16} color={AiraColors.primary} />
                    )}
                  </View>
                  <ThemedText style={[
                    styles.checkboxText,
                    data.priorities.length >= 3 && !data.priorities.includes(priority) && styles.checkboxTextDisabled
                  ]}>
                    {priority}
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
            style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
            onPress={isValid ? onNext : undefined}
            disabled={!isValid}
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
  checkboxDisabled: {
    opacity: 0.5,
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
     
  },
  checkboxTextDisabled: {
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.5),
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
  nextButtonDisabled: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.5),
  },
  nextButtonText: {
    color: AiraColors.background,
    fontSize: 16,
    marginRight: 8,
  },
});
