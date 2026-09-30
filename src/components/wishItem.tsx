import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

  type Props = {
    id: string;
    title: string;
    isCompleted: boolean;
    priority: number;
    category: string;
    price: number;
    link?: string;
    deleteWish: (id: string) => void;
    toggleComplete: (id: string) => void;
  }

export default function WishItem({ id, title, isCompleted, priority, category, price, link,  deleteWish, toggleComplete } : Props) {
     const scale = useSharedValue(1);
     const rotation = useSharedValue(0);
     const [ isLongPressed, setIsLongPressed ] = useState(false);

    const longPressGesture = Gesture.LongPress()
    .onBegin(() => {
      scale.value = withTiming(0.95, {
        duration: 500,
        easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
      });
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onStart(() => {
        runOnJS(setIsLongPressed)(true);
      })
    .onFinalize(() => {
      scale.value = withTiming(1, {
        duration: 250,
        easing: Easing.bezier(0.82, 0.06, 0.42, 1.01),
      });
  });

 useEffect(() => {
    if(isLongPressed){
        rotation.value = withRepeat(
            withSequence(
                withTiming(-1.5, { duration: 100, easing: Easing.linear}),
                withTiming(1.5, { duration: 100, easing: Easing.linear })
            ),
            -1,
            true
        );
    } else{
        rotation.value = withTiming(0, { duration: 100 });
    }
 },
 [isLongPressed]
);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg`}
    ],
  }));

  return (
    <GestureDetector gesture={longPressGesture}>
      <Animated.View
                  className={`p-4 rounded-2xl flex-row items-center justify-between mb-3 shadow-sm border duration-200 ${
                    isCompleted ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100'
                  }`}
                  style={animatedStyle}
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
      
                    {category && <Text className="text-base">{category}</Text>}
      
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
                    { isLongPressed &&(
                        <TouchableOpacity onPress={() => deleteWish(id)} className="p-2">
                            <Text className="text-lg">🗑️</Text>
                        </TouchableOpacity>
                        )
                    }
                    
                  </View>
                </Animated.View>
    </GestureDetector>
  );
}