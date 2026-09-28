import { Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import * as Haptics from 'expo-haptics';
import { runOnJS } from "react-native-worklets";

type Props = {
  title: string;
  amount: number;
  isExpense: boolean;
  onDelete?: () => void;
};

export default function TransactionItem({
  title,
  amount,
  isExpense,
  onDelete,
}: Props) {
  const isExpanded = useSharedValue(false);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const deleteScale = useSharedValue(0);
  const color = useSharedValue("#ffffff");

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      isExpanded.value = !isExpanded.value;
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);

      if (isExpanded.value) {
        scale.value = withSpring(0.95);
        color.value = withTiming("#fda4af", { duration: 150 });

        deleteScale.value = withSpring(1.5);


        rotation.value = withRepeat(
          withSequence(
            withTiming(-0.2, { duration: 80 }),
            withTiming(0.2, { duration: 80 })
          ),
          -1, 
          true
        );
      } else {

        scale.value = withSpring(1);
        deleteScale.value = withTiming(0, { duration: 150 });
        color.value = withTiming("#ffffff", { duration: 150 });


        cancelAnimation(rotation);
        rotation.value = withSpring(0);
      }
    });


  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    backgroundColor: color.value,
  }));


  const animatedDeleteButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteScale.value }],
    opacity: deleteScale.value,
  }));

  return (
    <View className="relative mb-3 overflow-visible">
      <GestureDetector gesture={longPressGesture}>
        <Animated.View
          style={animatedCardStyle}
          className="bg-white p-4 rounded-xl flex-row justify-between items-center shadow-sm border border-slate-100"
        >
          <Text className="text-base text-slate-700 font-medium">{title}</Text>
          <Text
            className={`text-base font-bold ${
              isExpense ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {isExpense ? "-" : "+"}{amount.toLocaleString("hu-HU")} Ft
          </Text>
        </Animated.View>
      </GestureDetector>

      <Animated.View
        style={animatedDeleteButtonStyle}
        className="absolute -top-4 right-6 z-10 overflow-visible"
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (onDelete) onDelete();
          }}
          className="bg-rose-500 w-6 h-6 rounded-full shadow-md justify-center items-center"
        >
          <Text className="text-sm text-white">🗑️</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}