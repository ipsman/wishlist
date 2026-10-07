import CategoryPicker from "@/components/categories";
import Stars from "@/components/stars";
import { useSettings } from "@/context/settingsController";
import { useWishes } from "@/context/WishContext";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
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
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

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

    try {
      await addWish(
        title.trim(),
        isCompleted,
        getPriority(),
        getCategory(),
        finalPrice,
        link.trim(),
        selectedImage,
      );

      setTitle("");
      setPrize("");
      setLink("");
      setSelectedImage(undefined);
      setPriority(0);
      Keyboard.dismiss();

      router.navigate("/(tabs)/myWishListScreen");
    } catch (error) {
      console.error("Hiba a mentés során:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(
    (id: string) => {
      deleteWish(id);
    },
    [deleteWish]
  );

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-slate-100">
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

          {/* Képválasztó gomb */}
          <TouchableOpacity
            style={{ backgroundColor: appColor }}
            className="p-3.5 rounded-xl items-center mb-3"
            onPress={pickImageAsync}
          >
            <Text className="text-white font-bold text-base">Add Image</Text>
          </TouchableOpacity>

          {/* Kiválasztott kép előnézete - csak akkor jelenik meg, ha van kép */}
          {selectedImage ? (
            <View className="items-center mb-3">
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-48 rounded-xl"
                resizeMode="cover"
              />
            </View>
          ) : null}

          <TouchableOpacity
            style={{ backgroundColor: title.trim() ? appColor : "#cbd5e1" }}
            className="p-3.5 rounded-xl items-center"
            disabled={!title.trim() || loading}
            onPress={() => handleAddTransaction(false)}
          >
            <Text className="text-white font-bold text-base">
              {loading ? "Adding..." : "Add Wish"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}