import { useSettings } from "@/context/settingsController";
import { useWishes } from "@/context/WishContext";
import {
  connectWithPairingCode,
  generatePairingCode,
  getPartnerId,
} from "@/services/partnerService";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { girlMode, setGirlMode, theme, setTheme } = useSettings();

  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState<string>("");
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { refreshPartner } = useWishes();

  useEffect(() => {
    checkPartnerStatus();
  }, []);

  const checkPartnerStatus = async () => {
    const pId = await getPartnerId();
    setPartnerId(pId);
  };

  const handleGenerateCode = async () => {
    try {
      setLoading(true);
      const code = await generatePairingCode();
      setGeneratedCode(code);
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült kódot generálni.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!inputCode.trim() || inputCode.length < 6) {
      Alert.alert("Hiba", "Kérlek, adj meg egy érvényes 6-jegyű kódot!");
      return;
    }

    try {
      setLoading(true);
      await connectWithPairingCode(inputCode.trim());
      await refreshPartner();
      await checkPartnerStatus();

      setInputCode("");
      Keyboard.dismiss();
      Alert.alert("Siker! 🎉", "Sikeresen összekapcsolódtatok a pároddal!");
    } catch (error: any) {
      Alert.alert("Hiba", error.message || "Sikertelen összekapcsolás.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ScrollView
        className="flex-1 px-5 pt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-2xl font-bold text-center mb-5 text-slate-800">
          Settings
        </Text>

        {/* 1. KÁRTYA: MEGLÉVŐ BEÁLLÍTÁSOK */}
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
        </View>

        {/* 2. KÁRTYA: PÁROS ÁLLAPOT */}
        <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm">
          <Text className="text-base font-bold text-slate-700 mb-2">
            Partner connection state
          </Text>
          {partnerId ? (
            <View className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex-row items-center gap-2">
              <Text className="text-emerald-600 font-bold text-sm">
                Connected with your partner! ❤️
              </Text>
            </View>
          ) : (
            <Text className="text-slate-400 text-xs">Not connected yet.</Text>
          )}
        </View>

        {/* 3. KÁRTYA: SAJÁT KÓD GENERÁLÁSA */}
        <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm">
          <Text className="text-base font-bold text-slate-700 mb-1">
            Your pairing code
          </Text>
          <Text className="text-xs text-slate-400 mb-3">
            Generate a code for your partner!
          </Text>

          {generatedCode ? (
            <View className="bg-slate-50 p-3 rounded-xl items-center mb-3 border border-slate-200">
              <Text className="text-xs text-slate-400 mb-0.5">Your code:</Text>
              <Text className="text-2xl font-extrabold tracking-widest text-slate-800">
                {generatedCode}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={handleGenerateCode}
            disabled={loading}
            className="bg-slate-800 p-3 rounded-xl items-center justify-center flex-row"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text className="text-white font-bold text-sm">
                Generate code ✨
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 4. KÁRTYA: PARTNER KÓDJÁNAK BEÍRÁSA */}
        <View className="bg-white p-4 rounded-2xl shadow-sm">
          <Text className="text-base font-bold text-slate-700 mb-1">
            Partners code
          </Text>
          <Text className="text-xs text-slate-400 mb-3">
            Type your partners 6-digit code to connect!
          </Text>

          <TextInput
            className="border border-slate-200 p-2.5 rounded-xl mb-3 text-base bg-slate-50 text-slate-800 text-center font-bold tracking-widest"
            placeholder="000000"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
            maxLength={6}
            value={inputCode}
            onChangeText={setInputCode}
          />

          <TouchableOpacity
            onPress={handleConnect}
            disabled={loading || inputCode.length < 6}
            style={{
              backgroundColor: inputCode.length === 6 ? "#10b981" : "#cbd5e1",
            }}
            className="p-3 rounded-xl items-center justify-center flex-row"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text className="text-white font-bold text-sm">Connect 🔗</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
