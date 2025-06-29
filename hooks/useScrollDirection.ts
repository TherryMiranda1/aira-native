import { useRef, useState, useCallback } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export const useScrollDirection = (threshold: number = 5) => {
  const [showText, setShowText] = useState(false);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<"up" | "down">("down");

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const diff = currentScrollY - lastScrollY.current;

      if (Math.abs(diff) > threshold) {
        const newDirection = diff > 0 ? "down" : "up";
        
        if (newDirection !== scrollDirection.current) {
          scrollDirection.current = newDirection;
          setShowText(newDirection === "up" && currentScrollY > 50);
        }
        
        lastScrollY.current = currentScrollY;
      }
    },
    [threshold]
  );

  return {
    showText,
    handleScroll,
  };
}; 