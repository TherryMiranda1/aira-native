import { useCallback, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

interface UseEndReachRefreshOptions {
  threshold?: number;
  onEndReach?: () => Promise<void> | void;
  enabled?: boolean;
}

export const useEndReachRefresh = ({
  threshold = 50,
  onEndReach,
  enabled = true,
}: UseEndReachRefreshOptions = {}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isEndReachTriggered = useRef(false);

  const handleScroll = useCallback(
    async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!enabled || !onEndReach || isRefreshing) return;

      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const distanceFromEnd = contentSize.height - (contentOffset.y + layoutMeasurement.height);

      if (distanceFromEnd <= threshold && !isEndReachTriggered.current) {
        isEndReachTriggered.current = true;
        setIsRefreshing(true);

        try {
          await onEndReach();
        } catch (error) {
          console.error("Error during end reach refresh:", error);
        } finally {
          setIsRefreshing(false);
          setTimeout(() => {
            isEndReachTriggered.current = false;
          }, 1000);
        }
      } else if (distanceFromEnd > threshold) {
        isEndReachTriggered.current = false;
      }
    },
    [threshold, onEndReach, enabled, isRefreshing]
  );

  return {
    handleScroll,
    isRefreshing,
  };
}; 