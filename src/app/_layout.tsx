import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { Stack } from "expo-router";
import { TransactionProvider } from "@/context/TransactionContext";


export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <TransactionProvider>
        <Stack screenOptions={{ headerShown: false }}/>
      </TransactionProvider>
    </GestureHandlerRootView>
  );
}
