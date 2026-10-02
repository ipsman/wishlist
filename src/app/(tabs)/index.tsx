import CategoryPicker from '@/components/categories';
import Stars from '@/components/stars';
import WishItem from '@/components/wishItem';
import { useSettings } from '@/context/settingsController';
import { useWishes } from '@/context/WishContext';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [title, setTitle] = useState('');
  const [prize, setPrize] = useState('');
  const [link, setLink] = useState('');
  const { appColor } = useSettings();

  const { wishes, addWish, deleteWish, toggleComplete, setCategory, getCategory, getPriority, setPriority } = useWishes();

  const handleAddTransaction = (isCompleted: boolean) => {
    if (!title.trim()) return;

    const parsedAmount = parseFloat(prize.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    addWish(title.trim(),isCompleted, getPriority(), getCategory(),  parsedAmount, link.trim());

    setTitle('');
    setPrize('');
    setLink('');
    setPriority(0);
    Keyboard.dismiss();
  };

  const handleDelete = useCallback((id: string) => {
    deleteWish(id);
  }, [deleteWish]);

  return (
    <SafeAreaView className="flex-1 bg-slate-100 px-5 pt-2">
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

        <CategoryPicker setCategory={setCategory} category={getCategory()}/>
        
          <TouchableOpacity
            style={{backgroundColor: appColor}}
            className={`p-3.5 rounded-xl items-center ${title.trim() ? 'bg-[#fa8cf1]' : 'bg-slate-300'}`}
            disabled={!title.trim()}
            onPress={() => handleAddTransaction(false)}
          >
            <Text className="text-white font-bold text-base">Add Wish</Text>
          </TouchableOpacity>
      </View>

      <Text className="text-base font-bold text-slate-800 px-2">My Wishes</Text>

      <FlatList
        data={wishes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 24, paddingHorizontal: 2 }}
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