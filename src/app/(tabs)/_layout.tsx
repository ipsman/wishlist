import { useSettings } from "@/context/settingsController";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { appColor, tabTitle } = useSettings();

  return (
      <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: appColor,
        tabBarInactiveTintColor: "#94a3b8",
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
            title: "Wishes",
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-outline" size={size} color={color} />
          ),
          }}
        />
        <Tabs.Screen name="budget" 
          options={{
            title: "My Wishlist",
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
          }}
        />
        <Tabs.Screen name="calendar" 
          options={{
            title: tabTitle,
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
          }}
        />
        <Tabs.Screen name="settings" 
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
          }}
        />
      </Tabs>
  );
}
