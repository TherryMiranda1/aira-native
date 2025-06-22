import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="recipe/[id]" />
      <Stack.Screen name="exercise/[id]" />
      <Stack.Screen name="plans/complete-plan/[id]" />
      <Stack.Screen name="plans/complete-plan" />
      <Stack.Screen name="plans/daily-meal-plan/[id]" />
      <Stack.Screen name="plans/daily-meal-plan" />
      <Stack.Screen name="plans/workout-routine/[id]" />
      <Stack.Screen name="plans/workout-routine" />
    </Stack>
  );
}
