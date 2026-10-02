import * as Haptics from 'expo-haptics';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, runOnJS, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { CATEGORIES } from './categories';

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
  }

export default function WishItem({ id, title, isCompleted, priority, category, price, link,  deleteWish, toggleComplete } : Props) {
  const isExpanded = useSharedValue(false);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const deleteScale = useSharedValue(0);
  const color = useSharedValue("#ffffff");
  const categoryEmoji = CATEGORIES.find((cat) => cat.key === category)?.emoji || category;

  const longPressGesture = Gesture.LongPress()
    .minDuration(150)
    .onStart(() => {
      isExpanded.value = !isExpanded.value;
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);

      if (isExpanded.value) {
        scale.value = withSpring(0.95);
        color.value = withTiming("#fda4af", { duration: 150 });

        deleteScale.value = withSpring(1.5);


        rotation.value = withRepeat(
          withSequence(
            withTiming(-0.25, { duration: 80 }),
            withTiming(0.25, { duration: 80 })
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
    <GestureDetector gesture={longPressGesture}>
      <View>
        <Animated.View
          style={animatedCardStyle}
          className="bg-white p-4 rounded-xl flex-row justify-between items-center shadow-sm border border-slate-100"
        >
          <TouchableOpacity
            onPress={() => toggleComplete(id)}
            className="flex-1 flex-row items-center gap-2"
          >
            <View
              className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                isCompleted ? 'bg-emerald-400 border-emerald-400' : 'border-slate-300'
              }`}
            >
              {isCompleted && <Text className="text-white text-xs">✓</Text>}
            </View>

            {category && <Text className="text-base">{categoryEmoji}</Text>}

            <View className="flex-1">
              <Text
                className={`text-base ${
                  isCompleted ? 'line-through text-slate-400' : 'text-slate-700 font-medium'
                }`}
                numberOfLines={1}
              >
                {title}
              </Text>
              <View className="flex-row items-center gap-2">
                {price && (
                  <Text className="text-xs text-slate-400">{price} Ft</Text>
                )}
                {priority > 1 && (
                  <Text className="text-xs">{'⭐'.repeat(priority)}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>

          <View className="flex-row gap-1">
            {link && (
              <TouchableOpacity onPress={() => Linking.openURL(link)} className="p-2">
                <Text className="text-lg">🔗</Text>
              </TouchableOpacity>
            )}

            
          </View>
        </Animated.View>
        <Animated.View style={animatedDeleteButtonStyle}
        className="absolute -top-4 right-6 z-10 overflow-visible">
          <TouchableOpacity onPress={() => deleteWish(id)} className="bg-rose-500 w-6 h-6 rounded-full shadow-md justify-center items-center">
              <Text className="text-md">🗑️</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}