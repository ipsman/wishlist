import MyWishList from "@/components/myWishList";
import { useWishes } from "@/context/WishContext";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function MyWishListScreen() {
    const { wishes, deleteWish, toggleComplete } = useWishes()

  return (
    <SafeAreaView>
        <View className="flex-1 px-5 pt-2 bg-slate-100">
        <Text className="text-xl font-bold text-center mb-4 text-slate-800">
            My WishList
        </Text>
        <MyWishList 
            wishes={wishes}
            handleDelete={deleteWish}
            toggleComplete={toggleComplete}
        />
        </View>
    </SafeAreaView>
  );
}
