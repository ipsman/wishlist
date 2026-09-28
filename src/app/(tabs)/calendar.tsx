import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactions } from "@/context/TransactionContext";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getBudgetForMonth, setBudgetForMonth, totalFixedExpenses } = useTransactions();

  // ÉÉÉÉ-HH formátum az adattároláshoz
  const monthKey = selectedDate.toISOString().slice(0, 7);
  const currentBudget = getBudgetForMonth(monthKey);
  const [tempBudget, setTempBudget] = useState(currentBudget.toString());

  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + offset, 1);
    setSelectedDate(newDate);
    setTempBudget(getBudgetForMonth(newDate.toISOString().slice(0, 7)).toString());
  };

  const handleSaveBudget = () => {
    const num = parseFloat(tempBudget.replace(",", "."));
    if (!isNaN(num) && num > 0) {
      setBudgetForMonth(monthKey, num);
    }
  };

  const monthName = selectedDate.toLocaleDateString("hu-HU", { year: "numeric", month: "long" });

  return (
    <SafeAreaView className="flex-1 bg-slate-100 px-5 pt-2">
      <Text className="text-xl font-bold text-center mb-4 text-slate-800">
        Jövőbeli Tervező
      </Text>

      {/* Hónap léptető header */}
      <View className="flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-4">
        <TouchableOpacity onPress={() => changeMonth(-1)} className="p-2 bg-slate-100 rounded-xl">
          <Text className="font-bold text-slate-700">{"<"}</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-800 capitalize">{monthName}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)} className="p-2 bg-slate-100 rounded-xl">
          <Text className="font-bold text-slate-700">{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Kiválasztott hónap keretének beállítása */}
      <View className="bg-white p-5 rounded-2xl shadow-sm mb-4">
        <Text className="text-sm font-semibold text-slate-500 mb-2">
          Tervezett költségkeret erre a hónapra
        </Text>
        <View className="flex-row gap-2 mb-4">
          <TextInput
            className="flex-1 border border-slate-200 p-2.5 rounded-xl text-base bg-slate-50 text-slate-800"
            keyboardType="decimal-pad"
            value={tempBudget}
            onChangeText={setTempBudget}
          />
          <TouchableOpacity onPress={handleSaveBudget} className="bg-emerald-600 px-4 justify-center rounded-xl">
            <Text className="text-white font-bold">Mentés</Text>
          </TouchableOpacity>
        </View>

        {/* Előzetes kalkuláció a fix költségekkel */}
        <View className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <Text className="text-xs text-slate-500 mb-1">Várható költhető egyenleg:</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-slate-600">Keret - Fix költségek:</Text>
            <Text className="text-sm font-bold text-emerald-600">
              {(currentBudget - totalFixedExpenses).toLocaleString("hu-HU")} Ft
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}