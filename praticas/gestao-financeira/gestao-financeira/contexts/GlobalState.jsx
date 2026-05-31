// import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";
import { createContext, useCallback, useEffect, useState } from "react";

export const MoneyContext = createContext();

/*async function getAsyncStorage(setter) {
    try {
        const storedTransactions = await AsyncStorage.getItem("transactions");

        if (!storedTransactions) return;

        setter(JSON.parse(storedTransactions));
    }
    catch (e) {
        console.error(e);
    }
}*/

export default function GlobalState({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [cats, txs] = await Promise.all([
                api.listCategories(),
                api.listTransactions(),
            ]);

            setCategories(cats);
            setTransactions(txs);
        }
        catch (err) {
            setError(err.message ?? "Falha ao carregar o servidor");
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => refresh(), [refresh]);

    const addTransaction = useCallback(async (data) => {
        const created = await api.createTransaction(data);

        setTransactions((prev) => [created, ...prev]);

        return created;
    }, []);

    const removeTransaction = useCallback(async (id) => {
        await api.deleteTransaction(id);

        setTransactions((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addCategory = useCallback(async (data) => {
        const created = await api.createCategory(data);

        setCategories((prev) =>
            [...prev, created].sort((a, b) => a.displayName.localeCompare(b.displayName))
        );

        return created;
    }, []);

    const removeCategory = useCallback(async (id) => {
        await api.deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
    }, []);

    const globalExports = {
        transactions,
        categories,
        loading,
        error,
        refresh,
        addTransaction,
        removeTransaction,
        addCategory,
        removeCategory,
    };

    return (
        <MoneyContext.Provider value={globalExports}>
            {children}
        </MoneyContext.Provider>
    );
}
