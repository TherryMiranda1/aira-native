import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { AiraColors } from '@/constants/Colors';

interface NavigationContainerProps {
  children: React.ReactNode;
  screenName?: string;
  headerShown?: boolean;
  presentation?: 'modal' | 'card' | 'transparentModal';
  animation?: 'default' | 'fade' | 'slide_from_right' | 'slide_from_left' | 'slide_from_bottom' | 'none';
  title?: string;
}

/**
 * A standardized navigation container component that provides consistent
 * navigation behavior and animations across the app.
 */
export const NavigationContainer: React.FC<NavigationContainerProps> = ({
  children,
  screenName,
  headerShown = false,
  presentation = 'card',
  animation = 'default',
  title = '',
}) => {
  return (
    <View style={styles.container}>
      <Stack.Screen
        name={screenName}
        options={{
          headerShown,
          presentation,
          animation,
          title,
          headerStyle: {
            backgroundColor: AiraColors.card,
          },
          headerTintColor: AiraColors.foreground,
        }}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
