import { Tabs } from "expo-router";
import React from "react";
import { Easing, Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { TabBarIcon } from "@/components/ui/TabBarIcon";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: useThemeColor({}, "foreground"),
        tabBarInactiveTintColor: useThemeColor({}, "muted"),
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {
            backgroundColor: useThemeColor({}, "background"),
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
        name="wall"
        options={{
          title: "Muro",
          tabBarIcon: ({ color }) => (
            <TabBarIcon size={28} name="reader-outline" color={color} />
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
          title: "Aira",
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
