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
    category: string;
}

export default function CategoryPicker ({setCategory, category} : Props) {
    return(
         <View className="flex-row items-center gap-2 mb-3">
          <Text className="text-sm text-slate-500 mr-1">Category:</Text>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              className={`flex-1 p-2.5 rounded-xl items-center border-2 ${
                category === cat.key ? 'bg-[#fa8cf1] border-[#fa8cf1]' : 'bg-slate-50 border-slate-200'
              }`}
              onPress={() => setCategory(cat.key)}
            >
              <Text className="text-lg">{cat.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
    );
}
