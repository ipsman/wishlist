import { useSettings } from "@/context/settingsController";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  comment?: string;
  imageLink?: string;
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
  comment,
  imageLink,
  deleteWish,
  toggleComplete,
}: Props) {
  const { theme } = useSettings();
  const isDarkMode = theme?.toLowerCase() === "dark";

  const isExpanded = useSharedValue(false);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const deleteScale = useSharedValue(0);
  const color = useSharedValue(isDarkMode ? "#1e293b" : "#ffffff");
  const [isImageOpened, setImageOpened] = useState(false);

  const categoryEmoji =
    CATEGORIES.find((cat) => cat.key === category)?.emoji || category;

  const hasImage = typeof imageLink === "string" && imageLink.trim().length > 0;
  const secureImageUri = imageLink?.replace("http://", "https://");

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
        color.value = withTiming(isDarkMode ? "#1e293b" : "#ffffff", {
          duration: 150,
        });

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
              borderColor: isDarkMode ? "#334155" : "#f1f5f9",
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
                  : "border-slate-300 dark:border-slate-600"
              }`}
            >
              {isCompleted ? (
                <Text className="text-white text-xs font-bold">✓</Text>
              ) : null}
            </View>

            {category ? (
              <Text className="text-base">{categoryEmoji}</Text>
            ) : null}

            <View className="flex-1 ml-2">
              <Text
                className={`text-base ${
                  isCompleted
                    ? "line-through text-slate-400 dark:text-slate-500"
                    : "text-slate-700 dark:text-slate-100 font-medium"
                }`}
                numberOfLines={1}
              >
                {title}
              </Text>

              {Boolean(comment) ? (
                <Text
                  className={`text-base ${
                    isCompleted
                      ? "line-through text-slate-400 dark:text-slate-500"
                      : "text-slate-700 dark:text-slate-100"
                  }`}
                  numberOfLines={1}
                >
                  {comment}
                </Text>
              ) : null}

              {Boolean(price) ? (
                <View className="flex-row items-center gap-2 mt-0.5">
                  {typeof price === "number" && price > 0 ? (
                    <Text className="text-xs text-slate-400 dark:text-slate-400 font-medium">
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

          {hasImage ? (
            <TouchableOpacity
              onPress={() => setImageOpened(true)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: secureImageUri }}
                style={{ width: 48, height: 48, borderRadius: 8 }}
                resizeMode="cover"
                onError={(e) =>
                  console.log("Image load error:", e.nativeEvent.error)
                }
              />
            </TouchableOpacity>
          ) : null}

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

      {/* Full-screen Modal Image Viewer */}
      {isImageOpened ? (
        <Modal
          transparent={true}
          animationType="fade"
          visible={true}
          onRequestClose={() => setImageOpened(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setImageOpened(false)}
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity activeOpacity={1}>
              <Image
                source={{ uri: secureImageUri }}
                style={{ width: 340, height: 380, borderRadius: 16 }}
                resizeMode="cover"
                onError={(e) =>
                  console.log("Image load error:", e.nativeEvent.error)
                }
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      ) : null}

      {/* Delete Button */}
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
