import * as Haptics from "expo-haptics";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { CATEGORIES } from "./categories";

type Props = {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: number;
  category: string;
  price?: number;
  link?: string;
  deleteWish: (id: string) => void;
  toggleComplete: (id: string) => void;
};

export default function WishItem({
  id,
  title,
  isCompleted,
  priority,
  category,
  price,
  link,
  deleteWish,
  toggleComplete,
}: Props) {
  const isExpanded = useSharedValue(false);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const deleteScale = useSharedValue(0);
  const color = useSharedValue("#ffffff");

  const categoryEmoji =
    CATEGORIES.find((cat) => cat.key === category)?.emoji || category;

  const longPressGesture = Gesture.LongPress()
    .minDuration(150)
    .onStart(() => {
      isExpanded.value = !isExpanded.value;
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);

      if (isExpanded.value) {
        scale.value = withSpring(0.95);
        color.value = withTiming("#fda4af", { duration: 150 });
        deleteScale.value = withSpring(1);

        rotation.value = withRepeat(
          withSequence(
            withTiming(-1, { duration: 80 }),
            withTiming(1, { duration: 80 }),
          ),
          -1,
          true,
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
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    backgroundColor: color.value,
  }));

  const animatedDeleteButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteScale.value }],
    opacity: deleteScale.value,
  }));

  return (
    <View className="my-2 relative overflow-visible">
      <GestureDetector gesture={longPressGesture}>
        <Animated.View
          style={[
            animatedCardStyle,
            {
              padding: 16,
              borderRadius: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#f1f5f9",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => toggleComplete(id)}
            className="flex-1 flex-row items-center gap-3"
            activeOpacity={0.8}
          >
            <View
              className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                isCompleted
                  ? "bg-emerald-400 border-emerald-400"
                  : "border-slate-300"
              }`}
            >
              {isCompleted ? (
                <Text className="text-white text-xs font-bold">✓</Text>
              ) : null}
            </View>

            {
              /* Boolean(imageLink) ? (
              <Image
                source={{ uri: imageLink }}
                className="w-12 h-12 rounded-lg bg-slate-100"
                resizeMode="cover"
              />
            ) :  */ Boolean(category) ? (
                <Text className="text-base">{categoryEmoji}</Text>
              ) : null
            }

            <View className="flex-1">
              <Text
                className={`text-base ${
                  isCompleted
                    ? "line-through text-slate-400"
                    : "text-slate-700 font-medium"
                }`}
                numberOfLines={1}
              >
                {title}
              </Text>

              {Boolean(price) || priority > 1 ? (
                <View className="flex-row items-center gap-2 mt-0.5">
                  {typeof price === "number" && price > 0 ? (
                    <Text className="text-xs text-slate-400 font-medium">
                      {price} Ft
                    </Text>
                  ) : null}
                  {priority > 1 ? (
                    <Text className="text-xs">{"⭐".repeat(priority)}</Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          </TouchableOpacity>

          {Boolean(link) ? (
            <TouchableOpacity
              onPress={() => link && Linking.openURL(link)}
              className="p-2 ml-1"
            >
              <Text className="text-lg">🔗</Text>
            </TouchableOpacity>
          ) : null}
        </Animated.View>
      </GestureDetector>
      <Animated.View
        style={[
          animatedDeleteButtonStyle,
          {
            position: "absolute",
            top: -10,
            right: 12,
            zIndex: 20,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => deleteWish(id)}
          className="bg-rose-500 w-8 h-8 rounded-full justify-center items-center shadow-md"
          activeOpacity={0.7}
        >
          <Text className="text-xs text-white">🗑️</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
