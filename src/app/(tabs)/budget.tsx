import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BudgetScreen() {
  
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
        <Text className="text-xl font-bold text-center mb-4 text-slate-800">
          Havi Költségvetés
        </Text>
    </SafeAreaView>
  );
}