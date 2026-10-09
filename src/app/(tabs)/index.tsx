import CategoryPicker from "@/components/categories";
import { useSettings } from "@/context/settingsController";
import { useWishes } from "@/context/WishContext";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [prize, setPrize] = useState("");
  const [link, setLink] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { appColor, theme } = useSettings();

  const scale = useSharedValue(1);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );

  const { addWish, setCategory, getCategory, getPriority, setPriority } =
    useWishes();

  const isDarkMode = theme?.toLowerCase() === "dark";
  const currentPriority = getPriority();

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
        comment.trim(),
        selectedImage,
      );

      setTitle("");
      setPrize("");
      setLink("");
      setComment("");
      setSelectedImage(undefined);
      setPriority(0);
      Keyboard.dismiss();

      router.navigate("/(tabs)/myWishListScreen");
    } catch (error) {
      console.error("Error saving wish:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const onPriorityChange = (num: number) => {
    const val = Math.round(num);
    if (val !== currentPriority) {
      setPriority(val);

      // Haptikus visszajelzés (rezgés) fokozatváltáskor
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Ruganyos dobbanás animáció
      scale.value = withSequence(
        withSpring(1.4, { damping: 8, stiffness: 220 }),
        withSpring(1, { damping: 10, stiffness: 150 }),
      );
    }
  };

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // A kiválasztott prioritáshoz tartozó egyedi címkék
  const priorityLabels = [
    "Nice to have ☁️",
    "Would be cool ✨",
    "Want it! 💖",
    "Must have 🔥",
    "TOP PRIORITY 👑",
  ];

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="flex-1 bg-slate-100 dark:bg-slate-900"
    >
      <View className="flex-1 px-5 pt-2">
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <Text className="text-xl font-bold text-center mb-3 text-slate-800 dark:text-white">
          ✨My Wishlist✨
        </Text>

        <View className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl mb-5 shadow-sm border border-transparent dark:border-slate-700">
          <TextInput
            className="border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl mb-2.5 text-base bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
            placeholder="Wish Name"
            placeholderTextColor="#94a3b8"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            className="border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl mb-3 text-base bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
            placeholder="Wish Link"
            placeholderTextColor="#94a3b8"
            value={link}
            onChangeText={setLink}
          />
          <TextInput
            className="border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl mb-3 text-base bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
            placeholder="Wish Amount (Ft)"
            placeholderTextColor="#94a3b8"
            keyboardType="decimal-pad"
            value={prize}
            onChangeText={setPrize}
          />

          <TextInput
            className="border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl mb-3 text-base bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
            placeholder="Comment"
            placeholderTextColor="#94a3b8"
            value={comment}
            onChangeText={setComment}
          />

          {/* STÍLUSOS PRIORITY KÁRTYA */}
          <View className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl mb-3 border border-slate-200/80 dark:border-slate-700">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Priority Level
              </Text>

              <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {priorityLabels[Math.max(0, currentPriority - 1)]}
              </Text>
            </View>

            {/* Dobbanó Csillagok és Érték */}
            <View className="items-center my-2">
              <Animated.View
                style={[animatedTextStyle]}
                className="flex-row items-center gap-1"
              >
                <Text className="text-2xl font-black text-amber-400">
                  {"⭐".repeat(currentPriority)}
                </Text>
                <Text className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-1">
                  ({currentPriority}/5)
                </Text>
              </Animated.View>
            </View>

            {/* Egyedi Témázható Slider */}
            <Slider
              style={{ width: "100%", height: 36 }}
              value={currentPriority}
              onValueChange={onPriorityChange}
              minimumValue={1}
              maximumValue={5}
              step={1}
              minimumTrackTintColor={appColor}
              maximumTrackTintColor={isDarkMode ? "#334155" : "#cbd5e1"}
              thumbTintColor={appColor}
            />
          </View>

          <CategoryPicker setCategory={setCategory} category={getCategory()} />

          {/* Add Image Button */}
          <TouchableOpacity
            style={{ backgroundColor: appColor }}
            className="p-3.5 rounded-xl items-center mb-3 mt-1"
            onPress={pickImageAsync}
          >
            <Text className="text-white font-bold text-base">Add Image</Text>
          </TouchableOpacity>

          {/* Image Preview */}
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
            style={{
              backgroundColor: title.trim()
                ? appColor
                : isDarkMode
                  ? "#334155"
                  : "#cbd5e1",
            }}
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
