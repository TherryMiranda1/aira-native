import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";

const SWIPE_THRESHOLD = -150;

export const useDeleteGesture = (
  onDelete: () => void,
  onPassThreshold?: () => void,
  onReturnOffThreshold?: () => void
) => {
  const translateX = useSharedValue(0);

  const deleteGesture = Gesture.Pan()
    .activateAfterLongPress(100)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      if (translateX.value < SWIPE_THRESHOLD) {
        onPassThreshold && runOnJS(onPassThreshold)();
      } else {
        onReturnOffThreshold && runOnJS(onReturnOffThreshold)();
      }
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        runOnJS(onDelete)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedDeleteStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return { deleteGesture, animatedDeleteStyle, translateX };
};
