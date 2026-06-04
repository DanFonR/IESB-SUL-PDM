import { api, setToken } from "../services/api";
import { createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MoneyContext = createContext();

/**
 * @description Restaura a sessão do usuário obtendo um token JWT e usando um setter para registrar o usuário
 * @param {(Object) => void} userSetter Função vinda de `useState` para guardar o usuário obtido da API
 */
async function restoreSession(userSetter) {
    const token = await AsyncStorage.getItem("@token");

    if (!token) return false;

    setToken(token);

    try {
        const me = await api.getUser();

        userSetter(me);

        return true;
    }
    catch {
        // Token expirado ou inválido
        await AsyncStorage.removeItem("@token");
        setToken(null);

        return false;
    }
}

export default function GlobalState({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const now = new Date();
    const [filtroMes, setFiltroMes] = useState(now.getMonth() + 1);
    const [filtroAno, setFiltroAno] = useState(now.getFullYear());

    // Ao inicializar o app, checar se há token para logar o usuário automaticamente
    useEffect(() => {
        restoreSession(setUser)
        .finally(() => setLoading(false))
    }, []);

    /**
     * @description Recarrega a aba principal com filtro de data
     * @param {number?} mes Mês para filtrar
     * @param {number?} ano Ano para filtrar
     */
    const refresh = useCallback(/** @param {number?} mes @param {number?} ano */ async (mes, ano) => {
        setLoading(true);
        setError(null);

        const mesSelecionado = mes ?? filtroMes;
        const anoSelecionado = ano ?? filtroAno;

        try {
            const [cats, txs] = await Promise.all([
                api.listCategories(),
                api.listTransactions(mesSelecionado, anoSelecionado),
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
    }, [filtroMes, filtroAno]);

    useEffect(() => { if (user) refresh(); }, [user, refresh]);

    const changeFilter = useCallback((mes, ano) => {
        setFiltroAno(ano);
        setFiltroMes(mes);
    }, []);

    const login = useCallback(async (email, password) => {
        const { user, token } = await api.login({ email, password });

        await AsyncStorage.setItem("@token", token);
        setToken(token);
        setUser(user);
    }, []);

    const register = useCallback(async (name, email, password) => {
        const { user, token } = await api.register({ name, email, password });

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

    const updateTransaction = useCallback(async (id, data) => {
        const updated = await api.updateTransaction(id, data);

        setTransactions((prev) => (
            prev.map((t) => ((t.id === id)? {...t, ...updated} : t))
        ));
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

    const updateCategory = useCallback(async (id, data) => {
        const updated = await api.updateCategory(id, data);

        setCategories((prev) => (
            prev.map((c) => ((c.id === id)? {...c, ...updated} : c))
        ));
    }, []);

    const removeCategory = useCallback(async (id) => {
        await api.deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
    }, []);

    const globalExports = {
        categories,
        error,
        filtroAno,
        filtroMes,
        loading,
        transactions,
        user,
        addCategory,
        addTransaction,
        changeFilter,
        login,
        logout,
        register,
        refresh,
        removeCategory,
        removeTransaction,
        updateCategory,
        updateTransaction,
    };

    return (
        <MoneyContext.Provider value={globalExports}>
            {children}
        </MoneyContext.Provider>
    );
}
