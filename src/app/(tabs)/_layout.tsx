import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
      <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#059669", // emerald-600
        tabBarInactiveTintColor: "#94a3b8", // slate-400
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}>
        <Tabs.Screen name="index" 
          options={{
            title: "Tranzakciók",
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
          }}
        />
        <Tabs.Screen name="budget" 
          options={{
            title: "Költségvetés",
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart-outline" size={size} color={color} />
          ),
          }}
        />
        <Tabs.Screen name="calendar" 
          options={{
            title: "Naptár",
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
          }}
        />
        <Tabs.Screen name="settings" 
          options={{
            title: "Beállítások",
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
          }}
        />
      </Tabs>
  );
}
