import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { AiraColors, AiraColorsWithAlpha } from '@/constants/Colors';
import { OnboardingData } from '@/app/onboarding';
import { AiraVariants } from '@/constants/Themes';

interface LifestyleStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const scheduleOptions = [
  'Horario regular (9-5)',
  'Horario flexible',
  'Turnos rotativos',
  'Trabajo nocturno',
  'Estudiante',
  'Ama de casa'
];

const sleepOptions = [
  'Menos de 6 horas',
  '6-7 horas',
  '7-8 horas',
  'Más de 8 horas'
];

const stressOptions = [
  'Bajo (raramente me siento estresada)',
  'Moderado (estrés ocasional)',
  'Alto (estrés frecuente)',
  'Muy alto (estrés constante)'
];

const supportOptions = [
  'Fuerte (familia/amigos muy involucrados)',
  'Moderado (algún apoyo disponible)',
  'Limitado (poco apoyo externo)',
  'Solo (principalmente por mi cuenta)'
];

export default function LifestyleStep({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}: LifestyleStepProps) {
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="sunny" size={48} color={AiraColors.primary} />
          <ThemedText style={styles.title}>Estilo de vida</ThemedText>
          <ThemedText style={styles.subtitle}>
            Cuéntame sobre tu rutina diaria para adaptar el plan a tu vida
          </ThemedText>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Horario */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Cómo es tu horario habitual?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {scheduleOptions.map((schedule) => (
                <TouchableOpacity
                  key={schedule}
                  style={[
                    styles.option,
                    data.schedule === schedule && styles.optionSelected
                  ]}
                  onPress={() => updateData({ schedule: schedule })}
                >
                  <ThemedText style={[
                    styles.optionText,
                    data.schedule === schedule && styles.optionTextSelected
                  ]}>
                    {schedule}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Horas de sueño */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Cuántas horas duermes normalmente?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {sleepOptions.map((sleep) => (
                <TouchableOpacity
                  key={sleep}
                  style={[
                    styles.option,
                    data.sleepHours === sleep && styles.optionSelected
                  ]}
                  onPress={() => updateData({ sleepHours: sleep })}
                >
                  <ThemedText style={[
                    styles.optionText,
                    data.sleepHours === sleep && styles.optionTextSelected
                  ]}>
                    {sleep}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Nivel de estrés */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Cuál es tu nivel de estrés habitual?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {stressOptions.map((stress) => (
                <TouchableOpacity
                  key={stress}
                  style={[
                    styles.option,
                    data.stressLevel === stress && styles.optionSelected
                  ]}
                  onPress={() => updateData({ stressLevel: stress })}
                >
                  <ThemedText style={[
                    styles.optionText,
                    data.stressLevel === stress && styles.optionTextSelected
                  ]}>
                    {stress}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Red de apoyo */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Cómo es tu red de apoyo?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {supportOptions.map((support) => (
                <TouchableOpacity
                  key={support}
                  style={[
                    styles.option,
                    data.support === support && styles.optionSelected
                  ]}
                  onPress={() => updateData({ support: support })}
                >
                  <ThemedText style={[
                    styles.optionText,
                    data.support === support && styles.optionTextSelected
                  ]}>
                    {support}
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
              Finalizar
            </ThemedText>
            <Ionicons name="checkmark" size={20} color="#fff" />
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
