import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { PageView } from '../ui/PageView';
import { Topbar } from '../ui/Topbar';
import { AiraColors } from '@/constants/Colors';

interface ModalScreenProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  headerRight?: React.ReactNode;
}

/**
 * A standardized modal screen component that provides consistent
 * modal presentation and navigation across the app.
 */
export const ModalScreen: React.FC<ModalScreenProps> = ({
  children,
  title,
  showBackButton = true,
  headerRight,
}) => {
  return (
    <PageView>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Topbar 
        title={title} 
        showBackButton={showBackButton}
        actions={headerRight}
      />
      <View style={styles.content}>
        {children}
      </View>
    </PageView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
});
