import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useState } from "react";

  export interface Settings{
    appColor: string;
    girlMode: boolean;
    theme: string;
    tabTitle: string;
  }

  interface SettingsContextType extends Settings {
    setGirlMode: (value: boolean) => void;
    setTheme: (theme: string) => void;
  }

  const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

  const STORAGE_KEY_SETTINGS = "@expensepro_settings";

  export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [girlMode, setGirlModeState] = useState<boolean>(false);
    const [theme, setTheme] = useState<string>('Light');

    const appColor = girlMode ? "#ff6cc7" : "#7dd3fc";
    const tabTitle = girlMode ? "His Wishlist" : "Her Wishlist";

    const setGirlMode = async (value: boolean) => {
        setGirlModeState(value);
        await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, )
    };




    return(
        <SettingsContext.Provider value={{ appColor, tabTitle, girlMode, theme, setGirlMode, setTheme }}>
            {children}
        </SettingsContext.Provider>

    );
  };

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if(!context){
        throw new Error('Nem jo;');
    }
    return context;
};