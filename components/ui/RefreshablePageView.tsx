import React, { useCallback, useState, useRef } from "react";
import { ScrollView, RefreshControl, ViewStyle, View } from "react-native";
import { PageView, PageViewProps } from "./PageView";
import { AiraColors } from "@/constants/Colors";
import { useEndReachRefresh } from "@/hooks/useEndReachRefresh";
import { ThemedText } from "@/components/ThemedText";

export interface RefreshablePageViewProps extends PageViewProps {
  onRefresh?: () => Promise<void> | void;
  onEndReach?: () => Promise<void> | void;
  refreshing?: boolean;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: ViewStyle;
  scrollViewStyle?: ViewStyle;
  endReachThreshold?: number;
  enableEndReachRefresh?: boolean;
  endReachText?: string;
}

export const RefreshablePageView = ({
  children,
  style,
  onRefresh,
  onEndReach,
  refreshing = false,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  scrollViewStyle,
  endReachThreshold = 50,
  enableEndReachRefresh = true,
  endReachText = "Desliza hacia abajo para actualizar",
}: RefreshablePageViewProps) => {
  const [internalRefreshing, setInternalRefreshing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { handleScroll: handleEndReachScroll, isRefreshing: isEndReachRefreshing } = 
    useEndReachRefresh({
      threshold: endReachThreshold,
      onEndReach,
      enabled: enableEndReachRefresh && !!onEndReach,
    });

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;

    setInternalRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setInternalRefreshing(false);
    }
  }, [onRefresh]);

  const combinedScrollHandler = useCallback((event: any) => {
    handleEndReachScroll(event);
  }, [handleEndReachScroll]);

  const isRefreshing = refreshing || internalRefreshing;

  return (
    <PageView style={style}>
      <ScrollView
        ref={scrollViewRef}
        style={[{ flex: 1 }, scrollViewStyle]}
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        onScroll={combinedScrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={AiraColors.airaLavender}
              colors={[AiraColors.airaLavender]}
              progressBackgroundColor={AiraColors.card}
            />
          ) : undefined
        }
      >
        {children}
        
        {enableEndReachRefresh && onEndReach && (
          <View style={{
            paddingVertical: 20,
            alignItems: 'center',
            opacity: isEndReachRefreshing ? 1 : 0.6,
          }}>
            <ThemedText style={{
              fontSize: 14,
              color: AiraColors.mutedForeground,
              textAlign: 'center',
            }}>
              {isEndReachRefreshing ? "Actualizando..." : endReachText}
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </PageView>
  );
}; 