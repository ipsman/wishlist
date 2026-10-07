import { db } from "@/firebase";
import { getOrCreateUserId, getPartnerId } from "@/services/partnerService";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
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
  partnerWishes: Wish[];
  addWish: (
    title: string,
    isCompleted: boolean,
    priority: number,
    category: string,
    price: number,
    link: string,
  ) => Promise<void>;
  deleteWish: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  togglePartnerComplete: (id: string) => Promise<void>;
  setCategory: (category: string) => void;
  getCategory: () => string;
  setPriority: (priority: number) => void;
  getPriority: () => number;
  refreshPartner: () => void;
}

const WishContext = createContext<WishContextType | undefined>(undefined);

export function WishProvider({ children }: { children: React.ReactNode }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [partnerWishes, setPartnerWishes] = useState<Wish[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [partnerId, setPartnerIdState] = useState<string | null>(null);
  const [category, setCategoryState] = useState<string>("karacsony");
  const [priority, setPriorityState] = useState<number>(0);

  // 1. User ID & Partner ID betöltése indításkor
  useEffect(() => {
    let isMounted = true;
    async function initUsers() {
      try {
        const currentUserId = await getOrCreateUserId();
        if (isMounted) setUserId(currentUserId);

        const currentPartnerId = await getPartnerId();
        if (isMounted) setPartnerIdState(currentPartnerId);
      } catch (error) {
        console.error("Hiba a felhasználó inicializálásakor:", error);
      }
    }
    initUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. SAJÁT KÍVÁNSÁGOK - Csak akkor iratkozik fel, ha a userId már létezik!
  useEffect(() => {
    if (!userId) {
      console.log("WAITING: userId még null/undefined Androidon...");
      return;
    } // Vár amíg az AsyncStorage visszatér Androidon

    console.log("CONNECTING FIRESTORE with userId:", userId);
    const myWishesRef = collection(db, "users", userId, "wishes");

    const unsubscribe = onSnapshot(
      myWishesRef,
      (snapshot) => {
        console.log("FIRESTORE GOT DOCS COUNT:", snapshot.docs.length);
        const loadedWishes: Wish[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Wish, "id">),
        }));
        setWishes(loadedWishes);
      },
      (error) => {
        console.error("Hiba a saját kívánságok feliratkozásakor:", error);
      },
    );

    return () => unsubscribe();
  }, [userId]); // 👈 KÖTELEZŐ: [userId] függőség!

  // 3. PARTNER KÍVÁNSÁGOK
  useEffect(() => {
    if (!partnerId) return;

    const partnerWishesRef = collection(db, "users", partnerId, "wishes");

    const unsubscribe = onSnapshot(
      partnerWishesRef,
      (snapshot) => {
        const loadedWishes: Wish[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Wish, "id">),
        }));
        setPartnerWishes(loadedWishes);
      },
      (error) => {
        console.error("Hiba a partner kívánságok feliratkozásakor:", error);
      },
    );

    return () => unsubscribe();
  }, [partnerId]); // 👈 KÖTELEZŐ: [partnerId] függőség!

  const addWish = async (
    title: string,
    isCompleted: boolean,
    priority: number,
    category: string,
    price: number,
    link: string,
  ) => {
    // Biztosítjuk, hogy legyen valid userId mentés előtt Androidon is
    const currentUserId = userId || (await getOrCreateUserId());

    await addDoc(collection(db, "users", currentUserId, "wishes"), {
      title,
      isCompleted: Boolean(isCompleted),
      priority,
      category,
      price: Number(price),
      link,
      createdAt: new Date().toISOString(),
    });
  };

  const deleteWish = async (id: string) => {
    const currentUserId = userId || (await getOrCreateUserId());
    await deleteDoc(doc(db, "users", currentUserId, "wishes", id));
  };

  const toggleComplete = async (id: string) => {
    const currentUserId = userId || (await getOrCreateUserId());
    const targetWish = wishes.find((w) => w.id === id);
    if (!targetWish) return;

    await updateDoc(doc(db, "users", currentUserId, "wishes", id), {
      isCompleted: !targetWish.isCompleted,
    });
  };

  const togglePartnerComplete = async (id: string) => {
    if (!partnerId) return;
    const targetWish = partnerWishes.find((w) => w.id === id);
    if (!targetWish) return;

    await updateDoc(doc(db, "users", partnerId, "wishes", id), {
      isCompleted: !targetWish.isCompleted,
    });
  };

  const refreshPartner = async () => {
    const pId = await getPartnerId();
    setPartnerIdState(pId);
  };

  return (
    <WishContext.Provider
      value={{
        wishes,
        partnerWishes,
        addWish,
        deleteWish,
        toggleComplete,
        togglePartnerComplete,
        setCategory: setCategoryState,
        getCategory: () => category,
        setPriority: setPriorityState,
        getPriority: () => priority,
        refreshPartner,
      }}
    >
      {children}
    </WishContext.Provider>
  );
}

export function useWishes() {
  const context = useContext(WishContext);
  if (!context) throw new Error("useWishes must be used within a WishProvider");
  return context;
}
