import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactions } from "@/context/TransactionContext";

export default function BudgetScreen() {
  const currentMonthKey = new Date().toISOString().slice(0, 7); // "2026-09"
  const {
    getBudgetForMonth,
    setBudgetForMonth,
    totalExpenses,
    fixedExpenses,
    addFixedExpense,
    deleteFixedExpense,
    totalFixedExpenses,
  } = useTransactions();

  const monthlyLimit = getBudgetForMonth(currentMonthKey);
  const [tempLimit, setTempLimit] = useState(monthlyLimit.toString());

  // Fix költség form state
  const [fixedTitle, setFixedTitle] = useState("");
  const [fixedAmount, setFixedAmount] = useState("");

  // Számított értékek
  const availableAfterFixed = monthlyLimit - totalFixedExpenses;
  const remainingToSpend = availableAfterFixed - totalExpenses;
  const percentage = Math.min(Math.round(((totalExpenses + totalFixedExpenses) / (monthlyLimit || 1)) * 100), 100);

  const handleSaveLimit = () => {
    const num = parseFloat(tempLimit.replace(",", "."));
    if (!isNaN(num) && num > 0) setBudgetForMonth(currentMonthKey, num);
  };

  const handleAddFixed = () => {
    const num = parseFloat(fixedAmount.replace(",", "."));
    if (fixedTitle.trim() && !isNaN(num) && num > 0) {
      addFixedExpense(fixedTitle.trim(), num);
      setFixedTitle("");
      setFixedAmount("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ScrollView className="flex-1 px-5 pt-2" showsVerticalScrollIndicator={false}>
        <Text className="text-xl font-bold text-center mb-4 text-slate-800">
          Havi Költségvetés
        </Text>

        {/* Keret összefoglaló kártya */}
        <View className="bg-white p-4 rounded-2xl shadow-sm mb-4">
          <Text className="text-xs font-semibold text-slate-500 mb-2">Havi keret lebontása</Text>
          
          <View className="flex-row justify-between mb-1">
            <Text className="text-sm text-slate-600">Összes keret:</Text>
            <Text className="text-sm font-bold text-slate-800">{monthlyLimit.toLocaleString("hu-HU")} Ft</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-sm text-rose-500">- Fix költségek összesen:</Text>
            <Text className="text-sm font-bold text-rose-500">-{totalFixedExpenses.toLocaleString("hu-HU")} Ft</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-sm text-amber-600">- Eddigi napi kiadások:</Text>
            <Text className="text-sm font-bold text-amber-600">-{totalExpenses.toLocaleString("hu-HU")} Ft</Text>
          </View>

          <View className="h-[1px] bg-slate-200 my-2" />

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-bold text-slate-800">Még költhető:</Text>
            <Text className={`text-xl font-extrabold ${remainingToSpend < 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {remainingToSpend.toLocaleString("hu-HU")} Ft
            </Text>
          </View>

          {/* Haladási sáv */}
          <View className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <View
              className={`h-full ${remainingToSpend < 0 ? "bg-rose-600" : "bg-emerald-500"}`}
              style={{ width: `${percentage}%` }}
            />
          </View>
        </View>

        {/* Fix költségek hozzáadása & listája */}
        <View className="bg-white p-4 rounded-2xl shadow-sm mb-4">
          <Text className="text-sm font-bold text-slate-800 mb-2">Fix költségek (Albérlet, Számlák, Net)</Text>
          
          <View className="flex-row gap-2 mb-3">
            <TextInput
              className="flex-2 border border-slate-200 p-2 rounded-xl text-sm bg-slate-50 flex-1"
              placeholder="Megnevezés"
              value={fixedTitle}
              onChangeText={setFixedTitle}
            />
            <TextInput
              className="border border-slate-200 p-2 rounded-xl text-sm bg-slate-50 w-28"
              placeholder="Összeg (Ft)"
              keyboardType="decimal-pad"
              value={fixedAmount}
              onChangeText={setFixedAmount}
            />
            <TouchableOpacity onPress={handleAddFixed} className="bg-slate-800 px-3 justify-center rounded-xl">
              <Text className="text-white font-bold text-xs">+ Hozzáadás</Text>
            </TouchableOpacity>
          </View>

          {/* Fix elemek listája */}
          {fixedExpenses.map((item) => (
            <View key={item.id} className="flex-row justify-between items-center py-2 border-b border-slate-100">
              <Text className="text-slate-700 font-medium text-sm">{item.title}</Text>
              <View className="flex-row items-center gap-3">
                <Text className="text-rose-600 font-bold text-sm">-{item.amount.toLocaleString("hu-HU")} Ft</Text>
                <TouchableOpacity onPress={() => deleteFixedExpense(item.id)}>
                  <Text className="text-slate-400 font-bold px-1">✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Havi keret módosítása */}
        <View className="bg-white p-4 rounded-2xl shadow-sm mb-6">
          <Text className="text-xs font-semibold text-slate-500 mb-2">Aktuális hónap keretének módosítása</Text>
          <View className="flex-row gap-2">
            <TextInput
              className="flex-1 border border-slate-200 p-2.5 rounded-xl text-base bg-slate-50"
              keyboardType="decimal-pad"
              value={tempLimit}
              onChangeText={setTempLimit}
            />
            <TouchableOpacity onPress={handleSaveLimit} className="bg-emerald-600 px-4 justify-center rounded-xl">
              <Text className="text-white font-bold">Mentés</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}