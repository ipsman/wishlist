import React, { useCallback, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExpenseItem from '@/components/expenseItem';
import { useTransactions } from '@/context/TransactionContext';

export default function HomeScreen() {
 const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  // 2. A helyi state HELYETT a Context-ből kéred le az adatokat és a funkciókat:
  const { transactions, totalBalance, addTransaction, deleteTransaction } = useTransactions();

  const handleAddTransaction = (isExpense: boolean) => {
    if (!title.trim() || !amount.trim()) return;

    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    // 3. Beküldjük a Context-be (ami elmenti az AsyncStorage-ba is)
    addTransaction(title.trim(), parsedAmount, isExpense);

    setTitle('');
    setAmount('');
    Keyboard.dismiss();
  };

  const handleDelete = useCallback((id: string) => {
    deleteTransaction(id);
  }, [deleteTransaction]);

  return (
    <SafeAreaView className="flex-1 bg-slate-100 px-5 pt-2">
      <StatusBar barStyle="dark-content" />
      <Text className="text-xl font-bold text-center mb-3 text-slate-800">
        Költségkalkulátor
      </Text>

      {/* Egyenleg kártya */}
      <View className="bg-white p-4 rounded-2xl items-center shadow-sm mb-3">
        <Text className="text-xs text-slate-500">Aktuális egyenleg</Text>
        <Text
          className={`text-2xl font-bold mt-0.5 ${
            totalBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {totalBalance.toLocaleString('hu-HU')} Ft
        </Text>
      </View>

      {/* Beviteli mezők kártyája */}
      <View className="bg-white p-3.5 rounded-2xl mb-5 shadow-sm">
        <TextInput
          className="border border-slate-200 p-2.5 rounded-xl mb-2.5 text-base bg-slate-50 text-slate-800"
          placeholder="Megnevezés (pl. Kávé, Tankolás)"
          placeholderTextColor="#94a3b8"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="border border-slate-200 p-2.5 rounded-xl mb-3 text-base bg-slate-50 text-slate-800"
          placeholder="Összeg (Ft)"
          placeholderTextColor="#94a3b8"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <View className="flex-row gap-2.5">
          <TouchableOpacity
            className="flex-1 bg-emerald-600 p-3 rounded-xl items-center"
            onPress={() => handleAddTransaction(false)}
          >
            <Text className="text-white font-bold text-base">+ Bevétel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-rose-600 p-3 rounded-xl items-center"
            onPress={() => handleAddTransaction(true)}
          >
            <Text className="text-white font-bold text-base">- Kiadás</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-base font-bold text-slate-800">Előzmények</Text>

      {/* FlatList: kiszedve a pt-6, így közvetlenül az "Előzmények" alatt kezdődik */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 24, paddingHorizontal: 2 }}
        ListEmptyComponent={
          <Text className="text-center text-slate-400 mt-4">
            Még nincs rögzített tétel.
          </Text>
        }
        renderItem={({ item }) => (
          <ExpenseItem
            title={item.title}
            amount={item.amount}
            isExpense={item.isExpense}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}