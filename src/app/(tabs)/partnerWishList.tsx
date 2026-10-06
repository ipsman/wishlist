import MyWishList from "@/components/myWishList";
import { useSettings } from "@/context/settingsController";
import { useWishes } from "@/context/WishContext";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PartnerWishList() {
  const { tabTitle } = useSettings();
  const { partnerWishes, deleteWish, toggleComplete } = useWishes()

  return (
    <SafeAreaView className="flex-1 bg-slate-100 px-5 pt-2">
      <View className="flex-1 px-5 pt-2">
      <Text className="text-xl font-bold text-center mb-4 text-slate-800">
        {tabTitle}
      </Text>
      <MyWishList 
        wishes={partnerWishes}
        handleDelete={deleteWish}
        toggleComplete={toggleComplete}
      />
      </View>
    </SafeAreaView>
  );
}