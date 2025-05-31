import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";

// Componentes de pasos
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import PersonalInfoStep from "@/components/onboarding/PersonalInfoStep";
import HealthStep from "@/components/onboarding/HealthStep";
import GoalsStep from "@/components/onboarding/GoalsStep";
import NutritionStep from "@/components/onboarding/NutritionStep";
import ActivityStep from "@/components/onboarding/ActivityStep";
import LifestyleStep from "@/components/onboarding/LifestyleStep";
import CompletionStep from "@/components/onboarding/CompletionStep";
import { AiraVariants } from "@/constants/Themes";
import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";

export interface OnboardingData {
  // Datos personales
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;

  // Salud
  healthConditions: string[];
  allergies: string[];
  medications: string;
  injuries: string;

  // Objetivos
  primaryGoal: string;
  timeline: string;
  commitment: string;
  priorities: string[];

  // Nutrición
  eatingHabits: string[];
  dietaryPreferences: string[];
  foodAversions: string[];
  cookingFrequency: string;
  budget: string;

  // Actividad física
  currentActivity: string;
  experience: string;
  preferences: string[];
  equipment: string[];
  frequency: string;
  duration: string;

  // Estilo de vida
  schedule: string;
  sleepHours: string;
  stressLevel: string;
  support: string;
}

const TOTAL_STEPS = 8;
const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    healthConditions: [],
    allergies: [],
    medications: "",
    injuries: "",
    primaryGoal: "",
    timeline: "",
    commitment: "",
    priorities: [],
    eatingHabits: [],
    dietaryPreferences: [],
    foodAversions: [],
    cookingFrequency: "",
    budget: "",
    currentActivity: "",
    experience: "",
    preferences: [],
    equipment: [],
    frequency: "",
    duration: "",
    schedule: "",
    sleepHours: "",
    stressLevel: "",
    support: "",
  });

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      scrollViewRef.current?.scrollTo({ x: newStep * width, animated: true });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      scrollViewRef.current?.scrollTo({ x: newStep * width, animated: true });
    }
  };

  const handleComplete = () => {
    // Aquí se enviarían los datos al backend
    console.log("Datos del onboarding:", data);

    // Navegar de vuelta al perfil o a la pantalla principal
    router.push("/profile");
  };

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <PageView>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Topbar
        title={
          currentStep === 0
            ? "Bienvenida"
            : `Paso ${currentStep} de ${TOTAL_STEPS - 2}`
        }
        showBackButton
      />

      {/* Barra de progreso */}
      {currentStep > 0 && currentStep < TOTAL_STEPS - 1 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <View style={styles.progressIcon}>
              <Ionicons name="heart" size={20} color={AiraColors.primary} />
            </View>
            <ThemedText style={styles.progressText}>
              Paso {currentStep} de {TOTAL_STEPS - 2}
            </ThemedText>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>
      )}

      {/* Contenido de los pasos */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        style={styles.scrollView}
      >
        {/* Paso 1: Bienvenida */}
        <View style={[styles.step, { width }]}>
          <WelcomeStep onNext={nextStep} />
        </View>

        {/* Paso 2: Información Personal */}
        <View style={[styles.step, { width }]}>
          <PersonalInfoStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        </View>

        {/* Paso 3: Salud */}
        <View style={[styles.step, { width }]}>
          <HealthStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        </View>

        {/* Paso 4: Objetivos */}
        <View style={[styles.step, { width }]}>
          <GoalsStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        </View>

        {/* Paso 5: Nutrición */}
        <View style={[styles.step, { width }]}>
          <NutritionStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        </View>

        {/* Paso 6: Actividad Física */}
        <View style={[styles.step, { width }]}>
          <ActivityStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        </View>

        {/* Paso 7: Estilo de Vida */}
        <View style={[styles.step, { width }]}>
          <LifestyleStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        </View>

        {/* Paso 8: Completado */}
        <View style={[styles.step, { width }]}>
          <CompletionStep data={data} onComplete={handleComplete} />
        </View>
      </Animated.ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: AiraColors.primary,
    borderRadius: AiraVariants.cardRadius,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 16,
  },

  step: {
    flex: 1,
  },
});
