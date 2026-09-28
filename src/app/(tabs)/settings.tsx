import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-1 px-5 pt-2">
        <Text className="text-2xl font-bold text-center mb-5 text-slate-800">
          Beállítások
        </Text>

        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
            <Text className="text-base text-slate-700 font-medium">Értesítések túllépésről</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#cbd5e1", true: "#10b981" }}
            />
          </View>

          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-slate-100">
            <Text className="text-base text-slate-700 font-medium">Pénznem</Text>
            <Text className="text-slate-400">HUF (Ft) ›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row justify-between items-center py-3">
            <Text className="text-base text-slate-700 font-medium">Adatok exportálása (CSV)</Text>
            <Ionicons name="download-outline" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}