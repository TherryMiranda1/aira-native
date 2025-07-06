import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen
        name="recipe/[id]"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="exercise/[id]"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="plans/complete-plan/[id]"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="plans/complete-plan" />
      <Stack.Screen
        name="plans/daily-meal-plan/[id]"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="plans/daily-meal-plan" />
      <Stack.Screen
        name="plans/workout-routine/[id]"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="plans/workout-routine" />
      <Stack.Screen name="plans/recipe-suggestion" />
      <Stack.Screen name="plans/exercise-suggestion" />

      <Stack.Screen name="inspiration/frases/[id]" />

      <Stack.Screen name="inspiration/mini-retos/[id]" />
      <Stack.Screen name="inspiration/rituales/[id]" />
      
      <Stack.Screen
        name="premium-plans"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
    </Stack>
  );
}
