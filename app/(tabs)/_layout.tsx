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
            height: 60,
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
        name="biblioteca"
        options={{
          title: "Biblioteca",
          tabBarIcon: ({ color }) => (
            <TabBarIcon size={28} name="library" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="metrics"
        options={{
          title: "Métricas",
          tabBarIcon: ({ color }) => (
            <TabBarIcon size={28} name="analytics" color={color} />
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
      <Tabs.Screen
        name="default-paywall"
        options={{
          title: "Paywals",
          href: null,

          tabBarIcon: ({ color }) => (
            <TabBarIcon size={28} name="wallet" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
