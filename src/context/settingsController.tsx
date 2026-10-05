import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Settings {
  girlMode: boolean;
  theme: string;
}

interface SettingsContextType extends Settings {
  appColor: string;
  tabTitle: string;
  setGirlMode: (value: boolean) => void;
  setTheme: (theme: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

const STORAGE_KEY_SETTINGS = "@expensepro_settings";

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [girlMode, setGirlModeState] = useState<boolean>(false);
  const [theme, setThemeState] = useState<string>("Light");

  const appColor = girlMode ? "#ff6cc7" : "#7dd3fc";
  const tabTitle = girlMode ? "His Wishlist" : "Her Wishlist";

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedSt = await AsyncStorage.getItem(STORAGE_KEY_SETTINGS);

        if (savedSt) {
          const parsed: Settings = JSON.parse(savedSt);
          setGirlMode(parsed.girlMode ?? false);
          setTheme(parsed.theme ?? "Light");
        }
      } catch (e) {
        console.error("Hiba az adatok betöltésekor:", e);
      }
    };
    loadData();
  }, []);

  const setGirlMode = async (value: boolean) => {
    setGirlModeState(value);
    saveSettings(value, theme);
  };

  const setTheme = async (value: string) => {
    setThemeState(value);
    saveSettings(girlMode, value);
  };

  const saveSettings = async (newGirlMode: boolean, newTheme: string) => {
    try {
      const settingsToSave: Settings = {
        girlMode: newGirlMode,
        theme: newTheme,
      };
      await AsyncStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify(settingsToSave),
      );
    } catch (e) {
      console.error("Hiba az adatok betöltésekor:", e);
    }
  };

  return (
    <SettingsContext.Provider
      value={{ appColor, tabTitle, girlMode, theme, setGirlMode, setTheme }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("Nem jo;");
  }
  return context;
};
