import { db } from "@/firebase";
import { getOrCreateUserId, getPartnerId, uploadImageToCloudinary } from "@/services/partnerService";
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
  imageUri?: string
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
    imageUri?: string
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

  useEffect(() => {
    if (!userId) {
      return;
    }

    const myWishesRef = collection(db, "users", userId, "wishes");

    const unsubscribe = onSnapshot(
      myWishesRef,
      (snapshot) => {
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
  }, [userId]);

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
  }, [partnerId]);

  const addWish = async (
    title: string,
    isCompleted: boolean,
    priority: number,
    category: string,
    price: number,
    link: string,
    imageUri?: string
  ) => {

    const currentUserId = userId || (await getOrCreateUserId());

    let imageUrl = "";
  if (imageUri) {
    // Ha a felhasználó választott képet, feltöltjük a Firebase Storage-ba
    imageUrl = await uploadImageToCloudinary(imageUri);
  }

    await addDoc(collection(db, "users", currentUserId, "wishes"), {
      title,
      isCompleted: Boolean(isCompleted),
      priority,
      category,
      price: Number(price),
      link,
      imageLink: imageUrl,
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
