import CategoryPicker from "@/components/categories";
import Stars from "@/components/stars";
import { useSettings } from "@/context/settingsController";
import { useWishes } from "@/context/WishContext";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [prize, setPrize] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const { appColor } = useSettings();

  const {
    wishes,
    addWish,
    deleteWish,
    toggleComplete,
    setCategory,
    getCategory,
    getPriority,
    setPriority,
  } = useWishes();

  const handleAddTransaction = async (isCompleted: boolean) => {
    if (!title.trim()) return;

    const parsedAmount = parseFloat(prize.replace(",", "."));
    const finalPrice = isNaN(parsedAmount) ? 0 : parsedAmount;

    setLoading(true);

    await addWish(
      title.trim(),
      isCompleted,
      getPriority(),
      getCategory(),
      parsedAmount,
      link.trim(),
    );

    setLoading(false);

    setTitle("");
    setPrize("");
    setLink("");
    setPriority(0);
    Keyboard.dismiss();

    router.push("/(tabs)/myWishListScreen");
  };

  const handleDelete = useCallback(
    (id: string) => {
      deleteWish(id);
    },
    [deleteWish],
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-100 pt-2">
      <View className="flex-1 px-5 pt-2">
        <StatusBar barStyle="dark-content" />
        <Text className="text-xl font-bold text-center mb-3 text-slate-800">
          ✨My Wishlist✨
        </Text>

        <View className="bg-white p-3.5 rounded-2xl mb-5 shadow-sm">
          <TextInput
            className="border border-slate-200 p-2.5 rounded-xl mb-2.5 text-base bg-slate-50 text-slate-800"
            placeholder="Wish Name"
            placeholderTextColor="#94a3b8"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            className="border border-slate-200 p-2.5 rounded-xl mb-3 text-base bg-slate-50 text-slate-800"
            placeholder="Wish Link"
            placeholderTextColor="#94a3b8"
            value={link}
            onChangeText={setLink}
          />
          <TextInput
            className="border border-slate-200 p-2.5 rounded-xl mb-3 text-base bg-slate-50 text-slate-800"
            placeholder="Wish Amount (Ft)"
            placeholderTextColor="#94a3b8"
            keyboardType="decimal-pad"
            value={prize}
            onChangeText={setPrize}
          />

          <Stars priority={getPriority()} setPriority={setPriority} />

          <CategoryPicker setCategory={setCategory} category={getCategory()} />

          <TouchableOpacity
            style={{ backgroundColor: title.trim() ? appColor : "#cbd5e1" }}
            className={`p-3.5 rounded-xl items-center`}
            disabled={!title.trim()}
            onPress={() => handleAddTransaction(false)}
          >
            <Text className="text-white font-bold text-base">Add Wish</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
