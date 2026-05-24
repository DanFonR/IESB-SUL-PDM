import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

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

    useEffect(() => getAsyncStorage(setTransactions), []);

    return (
        <MoneyContext.Provider value={[transactions, setTransactions]}>
            {children}
        </MoneyContext.Provider>
    );
}
