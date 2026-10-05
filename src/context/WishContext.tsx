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

  const cleanUrl = url.trim();

  try {
    // 1. Próbálkozás: Microlink API
    const res1 = await fetch(`https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}`);
    const json1 = await res1.json();
    if (json1.status === "success" && json1.data?.image?.url) {
      return json1.data.image.url;
    }

    // 2. Próbálkozás: JSONLink API (ha a Microlinket blokkolja pl. az Alza)
    const res2 = await fetch(`https://jsonlink.io/api/extract?url=${encodeURIComponent(cleanUrl)}`);
    const json2 = await res2.json();
    if (json2.images && json2.images.length > 0) {
      return json2.images[0];
    }
  } catch (error) {
    console.log("Nem sikerült előnézeti képet lekérni:", error);
  }

  // Ha az Alza teljesen blokkolja a lekérést, visszatérhetünk egy szép alapértelmezett ajándék képpel
  return "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=500&auto=format&fit=crop";
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