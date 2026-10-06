import WishItem from "@/components/wishItem";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyWishList() {
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <Text className="text-xl font-bold text-center mb-4 text-slate-800">
        My WishList
      </Text>
      <FlatList
        data={wishes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 24,
          paddingHorizontal: 2,
        }}
        ListEmptyComponent={
          <Text className="text-center text-lg text-slate-400 mt-4">
            No wishes yet😔
          </Text>
        }
        renderItem={({ item }) => (
          <WishItem
            id={item.id}
            title={item.title}
            isCompleted={item.isCompleted}
            priority={item.priority}
            category={item.category}
            price={item.price}
            link={item.link}
            deleteWish={handleDelete}
            toggleComplete={toggleComplete}
          />
        )}
      />
    </SafeAreaView>
  );
}
