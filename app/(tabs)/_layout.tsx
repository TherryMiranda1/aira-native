import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { TabBarIcon } from "@/components/ui/TabBarIcon";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AiraColors.foreground,
        tabBarInactiveTintColor: AiraColorsWithAlpha.foregroundWithOpacity(0.4),
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {
            backgroundColor: AiraColors.card,
            borderTopWidth: 0,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabBarIcon size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: "Ejercicios",
          tabBarIcon: ({ color }) => (
            <TabBarIcon size={28} name="fitness" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recetas",
          tabBarIcon: ({ color }) => (
            <TabBarIcon size={28} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="emotional-history"
        options={{
          title: "Emociones",
          tabBarIcon: ({ color }) => (
            <TabBarIcon size={28} name="heart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inspiration-center"
        options={{
          title: "Inspiración",
          tabBarIcon: ({ color }) => (
            <TabBarIcon size={28} name="sparkles" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <TabBarIcon size={28} name="chatbubble" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
