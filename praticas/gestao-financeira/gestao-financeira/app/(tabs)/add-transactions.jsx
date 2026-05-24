import {
    Alert, Keyboard, KeyboardAvoidingView,
    ScrollView, StyleSheet, TouchableWithoutFeedback,
    View
} from "react-native";
import Button from "../../components/Button";
import globalStyles from "../../styles/globalStyles";
import { useContext, useRef, useState } from "react";
import DescriptionInput from "../../components/DescriptionInput";
import CurrencyInput from "../../components/CurrencyInput";
import DatePicker from "../../components/DatePicker";
import CategoryPicker from "../../components/CategoryPicker";
import { MoneyContext } from "../../contexts/GlobalState";
import AsyncStorage from "@react-native-async-storage/async-storage";

function parseCurrency(text) {
    const value = text.replace("/\D/g", "");

    return (parseFloat(value) || 0.0) / 100;
}

async function setAsyncStorage(data) {
    try {
        await AsyncStorage.setItem("transactions", JSON.stringify(data));
    }
    catch (e) {
        console.error(e);
    }
}

const initialForm = {
    description: '',
    value: 0.0,
    date: new Date(),
    category: 'Renda',
};

export default function AddTransactions() {
    const [form, setForm] = useState(initialForm);
    const valueInputRef = useRef();
    const [transactions, setTransactions] = useContext(MoneyContext);

    const transactionAlert = () => Alert.alert(
        "Dados Prontos!",
        `${form.description} | ${form.value} | `
      + `${form.date.toLocaleDateString("pt-BR")} | ${form.category}`,
    );

    const addTransaction = async () => {
        const updatedTransactions = [...transactions, { id: transactions.length + 1, ...form }];

        setTransactions(updatedTransactions);
        setForm(initialForm);
        await setAsyncStorage(updatedTransactions);

        Alert.alert("Sucesso!", "Transação adicionada com sucesso!");
    }

    return (
        <KeyboardAvoidingView style={globalStyles.screenContainer} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView style={globalStyles.content}>
                    <View style={styles.form}>
                        <DescriptionInput
                            value={form.description}
                            onChange={(text) => setForm({ ...form, description: text })}
                            valueInputRef={valueInputRef}
                        />
                        <CurrencyInput
                            value={form.value}
                            onChange={(text) => setForm({...form, value: parseCurrency(text)})}
                            valueInputRef={valueInputRef}
                        />
                        <DatePicker
                            value={form.date}
                            onChange={(value) => setForm({...form, date: value})}
                        />
                        <CategoryPicker
                            value={form.category}
                            onChange={(itemValue) => setForm({ ...form, category: itemValue })}
                        />
                    </View>
                    <Button onPress={addTransaction}>Adicionar</Button>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    form: {
        gap: 12,
        marginTop: 10,
        marginBottom: 40,
    },
});
