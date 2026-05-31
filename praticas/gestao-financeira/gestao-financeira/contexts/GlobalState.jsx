// import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, setToken } from "../services/api";
import { createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MoneyContext = createContext();

async function getAsyncStorage(setter) {
    try {
        const storedTransactions = await AsyncStorage.getItem("transactions");

        if (!storedTransactions) return;

        setter(JSON.parse(storedTransactions));
    }
    catch (e) {
        console.error(e);
    }
}

export default function GlobalState({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [cats, txs] = await Promise.all([
                api.listCategories(),
                api.listTransactions(),
            ]);
            const token = AsyncStorage.getItem("@token");

            setCategories(cats);
            setTransactions(txs);

            if (token) {
                const me = await api.getUser();

                setToken(token);
                setUser(me);
            }
        }
        catch (err) {
            setError(err.message ?? "Falha ao carregar o servidor");
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => refresh(), [refresh]);

    const login = useCallback(async (email, password) => {
        const { user, token } = await api.login({ email, password });

        await AsyncStorage.setItem("@token", token);
        setToken(token);
        setUser(user);
    }, []);

    const logout = useCallback(async () => {
        await AsyncStorage.removeItem("@token");
        setToken(null);
        setUser(null);
    }, []);

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
        categories,
        error,
        loading,
        transactions,
        user,
        addCategory,
        addTransaction,
        login,
        logout,
        refresh,
        removeCategory,
        removeTransaction,
    };

    return (
        <MoneyContext.Provider value={globalExports}>
            {children}
        </MoneyContext.Provider>
    );
}
