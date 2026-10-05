import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Wish {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: number;
  category: string;
  price: number;
  link: string;
  imageLink?: string;
}

interface WishContextType {
  wishes: Wish[];
  addWish: (
    title: string,
    isCompleted: boolean,
    priority: number,
    category: string,
    price: number,
    link: string
  ) => Promise<void>;
  deleteWish: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  setCategory: (category: string) => void;
  getCategory: () => string;
  setPriority: (priority: number) => void;
  getPriority: () => number;
}

const WishContext = createContext<WishContextType | undefined>(undefined);
const STORAGE_KEY_WISHES = "@expensepro_wishes";

export function WishProvider({ children }: { children: React.ReactNode }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [category, setCategoryState] = useState<string>("karacsony");
  const [priority, setPriorityState] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedWs = await AsyncStorage.getItem(STORAGE_KEY_WISHES);
        if (savedWs) setWishes(JSON.parse(savedWs));
      } catch (e) {
        console.error("Hiba az adatok betöltésekor:", e);
      }
    };
    loadData();
  }, []);

  // Nyílt, CORS-barát API segítségével kérjük le a borítóképet
  const fetchImageUrl = async (url: string): Promise<string | undefined> => {
    if (!url || !url.trim()) return undefined;
    try {
      const response = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url.trim())}`
      );
      const json = await response.json();

      if (json.status === "success" && json.data?.image?.url) {
        return json.data.image.url;
      }
    } catch (error) {
      console.log("Nem sikerült előnézeti képet tölteni:", error);
    }
    return undefined;
  };

  const addWish = async (
    title: string,
    isCompleted: boolean,
    priority: number,
    category: string,
    price: number,
    link: string
  ) => {
    const fetchedImage = await fetchImageUrl(link);

    const newWs: Wish = {
      id: Date.now().toString(),
      title,
      isCompleted: Boolean(isCompleted),
      priority,
      category,
      price: Number(price),
      link,
      imageLink: fetchedImage,
    };

    const updated = [newWs, ...wishes];
    setWishes(updated);
    await AsyncStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(updated));
  };

  const deleteWish = async (id: string) => {
    const updated = wishes.filter((tx) => tx.id !== id);
    setWishes(updated);
    await AsyncStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(updated));
  };

  const toggleComplete = async (id: string) => {
    const updated = wishes.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setWishes(updated);
    await AsyncStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(updated));
  };

  const setCategory = (cat: string) => setCategoryState(cat);
  const getCategory = () => category;
  const setPriority = (p: number) => setPriorityState(p);
  const getPriority = () => priority;

  return (
    <WishContext.Provider
      value={{
        wishes,
        addWish,
        deleteWish,
        toggleComplete,
        setCategory,
        getCategory,
        setPriority,
        getPriority,
      }}
    >
      {children}
    </WishContext.Provider>
  );
}

export function useWishes() {
  const context = useContext(WishContext);
  if (!context)
    throw new Error("useWishes must be used within a WishProvider");
  return context;
}