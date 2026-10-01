export const CATEGORIES = [
  { key: 'karacsony', emoji: '🎄' },
  { key: 'szulinap', emoji: '🎂' },
  { key: 'nevnap', emoji: '📆' },
  { key: 'valentin', emoji: '❤️‍🔥' },
  { key: 'meglepi', emoji: '🎁' },
];


import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    setCategory: (category: string) => void;
}

export default function CategoryPicker ({setCategory} : Props) {
    return(
         <View className="flex-row items-center gap-2 mb-3">
          <Text className="text-sm text-slate-500 mr-1">Category:</Text>
          {CATEGORIES.map(category => (
            <TouchableOpacity key={category.key} onPress={() => setCategory(category.emoji)}>
              <Text className="text-xl">{category.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
    );
}
