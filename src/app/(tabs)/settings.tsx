import { useSettings } from "@/context/settingsController";
import { Ionicons } from "@expo/vector-icons";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { girlMode, setGirlMode, theme, setTheme } = useSettings();

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-1 px-5 pt-2">
        <Text className="text-2xl font-bold text-center mb-5 text-slate-800">
          Settings
        </Text>

        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
            <Text className="text-base text-slate-700 font-medium">
              Girl mode
            </Text>
            <Switch
              value={girlMode}
              onValueChange={setGirlMode}
              trackColor={{ false: "#7dd3fc", true: "#ff6cc7" }}
              thumbColor={"#ffffff"}
            />
          </View>
          <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
            <Text className="text-base text-slate-700 font-medium">
              Dark Mode
            </Text>
            <Switch
              value={theme === "Dark"}
              onValueChange={(value) => setTheme(value ? "Dark" : "Light")}
              trackColor={{ false: "#64748b", true: "#f1f5f9" }}
              thumbColor={"#ffffff"}
            />
          </View>
          <TouchableOpacity className="flex-row justify-between items-center py-3">
            <Text className="text-base text-slate-700 font-medium">
              Adatok exportálása (CSV)
            </Text>
            <Ionicons name="download-outline" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
