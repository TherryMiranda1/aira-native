import { router, usePathname } from 'expo-router';

/**
 * Navigation utility functions to standardize navigation across the app
 * 
 * This module provides a centralized place for all navigation-related functions
 * to ensure consistent navigation behavior across the app.
 */

/**
 * Navigate to a screen
 * @param href The route to navigate to
 * @param params Optional parameters to pass to the route
 */
export const navigateTo = (
  href: string, 
  params?: Record<string, string>
) => {
  router.push({
    pathname: href as any,
    params,
  });
};

/**
 * Navigate back to the previous screen
 */
export const goBack = () => {
  router.back();
};

/**
 * Replace the current screen with a new one
 * @param href The route to navigate to
 * @param params Optional parameters to pass to the route
 */
export const replaceTo = (href: string, params?: Record<string, string>) => {
  router.replace({
    pathname: href as any,
    params,
  });
};

/**
 * Navigate to the onboarding flow
 */
export const navigateToOnboarding = () => {
  navigateTo('/onboarding');
};

/**
 * Navigate to a recipe detail
 * @param id The recipe ID
 */
export const navigateToRecipeDetail = (id: string) => {
  navigateTo(`/recipe/${id}`);
};

/**
 * Navigate to an exercise detail
 * @param id The exercise ID
 */
export const navigateToExerciseDetail = (id: string) => {
  navigateTo(`/exercise/${id}`);
};

/**
 * Custom hook to get navigation information
 * @returns Object with navigation helper functions
 */
export const useNavigationInfo = () => {
  const pathname = usePathname();

  /**
   * Get the current active tab
   * @returns The current active tab name or null if not in a tab
   */
  const getActiveTab = (): string | null => {
    const tabRegex = /^\/(tabs\/)?([^\/]+)/;
    const match = pathname.match(tabRegex);
    return match ? match[2] : null;
  };

  /**
   * Check if a specific tab is active
   * @param tabName The tab name to check
   * @returns True if the tab is active, false otherwise
   */
  const isTabActive = (tabName: string): boolean => {
    return getActiveTab() === tabName;
  };

  return {
    getActiveTab,
    isTabActive,
  };
};

/**
 * Navigate to the emotional history tab
 */
export const navigateToEmotionalHistory = () => {
  navigateToTab('emotional-history');
};

/**
 * Navigate to the inspiration center tab
 */
export const navigateToInspirationCenter = () => {
  navigateToTab('inspiration-center');
};

/**
 * Navigate to the chat tab
 */
export const navigateToChat = () => {
  navigateToTab('chat');
};

/**
 * Navigate to the profile screen
 */
export const navigateToProfile = () => {
  navigateTo('/profile');
};

/**
 * Navigate to the sign in screen
 */
export const navigateToSignIn = () => {
  navigateTo('/sign-in');
};

/**
 * Navigate to the sign up screen
 */
export const navigateToSignUp = () => {
  navigateTo('/sign-up');
};

/**
 * Navigate to a specific tab
 * @param tab The tab name to navigate to
 */
export const navigateToTab = (tab: 'index' | 'exercises' | 'recipes' | 'emotional-history' | 'inspiration-center' | 'chat') => {
  navigateTo(`/(tabs)/${tab}`);
};
