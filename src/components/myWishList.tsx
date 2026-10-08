import WishItem from "@/components/wishItem";
import { Wish } from "@/context/WishContext";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  wishes: Wish[];
  handleDelete: (id: string) => void;
  toggleComplete: (id: string) => void;
};

export default function MyWishList({
  wishes,
  handleDelete,
  toggleComplete,
}: Props) {
  return (
    <SafeAreaView className="flex-1" style={{ flex: 1, width: "100%" }}>
      <FlatList
        data={wishes}
        extraData={wishes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 24,
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
            imageLink={item.imageLink}
            deleteWish={handleDelete}
            toggleComplete={toggleComplete}
          />
        )}
      />
    </SafeAreaView>
  );
}
