export const CATEGORIES = [
  { key: "karacsony", emoji: "🎄" },
  { key: "szulinap", emoji: "🎂" },
  { key: "nevnap", emoji: "📆" },
  { key: "valentin", emoji: "❤️‍🔥" },
  { key: "meglepi", emoji: "🎁" },
];

import { useSettings } from "@/context/settingsController";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  setCategory: (category: string) => void;
  category: string;
};

export default function CategoryPicker({ setCategory, category }: Props) {
  const { appColor } = useSettings();
  return (
    <View className="flex-row items-center gap-2 mb-3">
      <Text className="text-sm text-slate-500 mr-1">Category:</Text>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.key}
          style={{
            backgroundColor: category === cat.key ? appColor : "#f8fafc",
            borderColor: category === cat.key ? appColor : "#e2e8f0",
          }}
          className={`flex-1 p-2.5 rounded-xl items-center border-2`}
          onPress={() => setCategory(cat.key)}
        >
          <Text className="text-lg">{cat.emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
