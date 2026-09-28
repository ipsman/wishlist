import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  isExpense: boolean;
  date: string;
}

export interface FixedExpense {
  id: string;
  title: string;
  amount: number;
}

interface TransactionContextType {
  transactions: Transaction[];
  fixedExpenses: FixedExpense[];
  monthlyBudgets: Record<string, number>; // Pl: { "2026-10": 400000 }
  addTransaction: (title: string, amount: number, isExpense: boolean, date?: string) => void;
  deleteTransaction: (id: string) => void;
  addFixedExpense: (title: string, amount: number) => void;
  deleteFixedExpense: (id: string) => void;
  setBudgetForMonth: (monthKey: string, limit: number) => void;
  getBudgetForMonth: (monthKey: string) => number;
  totalBalance: number;
  totalExpenses: number;
  totalFixedExpenses: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const STORAGE_KEY_TRANSACTIONS = "@expensepro_transactions";
const STORAGE_KEY_FIXED = "@expensepro_fixed";
const STORAGE_KEY_BUDGETS = "@expensepro_budgets";

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedTx = await AsyncStorage.getItem(STORAGE_KEY_TRANSACTIONS);
        const savedFixed = await AsyncStorage.getItem(STORAGE_KEY_FIXED);
        const savedBudgets = await AsyncStorage.getItem(STORAGE_KEY_BUDGETS);

        if (savedTx) setTransactions(JSON.parse(savedTx));
        if (savedFixed) setFixedExpenses(JSON.parse(savedFixed));
        if (savedBudgets) setMonthlyBudgets(JSON.parse(savedBudgets));
      } catch (e) {
        console.error("Hiba az adatok betöltésekor:", e);
      }
    };
    loadData();
  }, []);

  const addTransaction = async (title: string, amount: number, isExpense: boolean, date?: string) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      title,
      amount: Number(amount),
      isExpense: Boolean(isExpense),
      date: date || new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await AsyncStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
  };

  const deleteTransaction = async (id: string) => {
    const updated = transactions.filter((tx) => tx.id !== id);
    setTransactions(updated);
    await AsyncStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
  };

  // Fix költségek kezelése
  const addFixedExpense = async (title: string, amount: number) => {
    const newFixed: FixedExpense = { id: Date.now().toString(), title, amount: Number(amount) };
    const updated = [...fixedExpenses, newFixed];
    setFixedExpenses(updated);
    await AsyncStorage.setItem(STORAGE_KEY_FIXED, JSON.stringify(updated));
  };

  const deleteFixedExpense = async (id: string) => {
    const updated = fixedExpenses.filter((item) => item.id !== id);
    setFixedExpenses(updated);
    await AsyncStorage.setItem(STORAGE_KEY_FIXED, JSON.stringify(updated));
  };

  // Hónapra bontott keretösszegek (pl. "2026-09")
  const setBudgetForMonth = async (monthKey: string, limit: number) => {
    const updated = { ...monthlyBudgets, [monthKey]: limit };
    setMonthlyBudgets(updated);
    await AsyncStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(updated));
  };

  const getBudgetForMonth = (monthKey: string) => {
    return monthlyBudgets[monthKey] || 350000; // Alapértelmezett 350.000 Ft
  };

  const totalBalance = transactions.reduce((acc, item) => {
    const amt = Number(item.amount) || 0;
    return item.isExpense ? acc - amt : acc + amt;
  }, 0);

  const totalFixedExpenses = fixedExpenses.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  const totalExpenses = transactions.reduce((acc, item) => {
    if (!item.isExpense) return acc;
    const txDate = new Date(item.date);
    const now = new Date();
    if (isNaN(txDate.getTime())) return acc + Number(item.amount);
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()
      ? acc + Number(item.amount)
      : acc;
  }, 0);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        fixedExpenses,
        monthlyBudgets,
        addTransaction,
        deleteTransaction,
        addFixedExpense,
        deleteFixedExpense,
        setBudgetForMonth,
        getBudgetForMonth,
        totalBalance,
        totalExpenses,
        totalFixedExpenses,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) throw new Error("useTransactions must be used within a TransactionProvider");
  return context;
}