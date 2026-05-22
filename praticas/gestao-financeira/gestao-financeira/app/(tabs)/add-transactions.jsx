import {
    Alert, Keyboard, KeyboardAvoidingView,
    ScrollView, StyleSheet, TouchableWithoutFeedback,
    View
} from "react-native";
import Button from "../../components/Button";
import globalStyles from "../../styles/globalStyles";
import { useRef, useState } from "react";
import DescriptionInput from "../../components/DescriptionInput";
import CurrencyInput from "../../components/CurrencyInput";
import DatePicker from "../../components/DatePicker";
import CategoryPicker from "../../components/CategoryPicker";

function parseCurrency(text) {
    const value = text.replace("/\D/g", "");

    return (parseFloat(value) || 0.0) / 100;
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

    const transactionAlert = () => Alert.alert(
        "Dados Prontos!",
        `${form.description} | ${form.value} | `
      + `${form.date.toLocaleDateString("pt-BR")} | ${form.category}`,
    );

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
                    <Button onPress={transactionAlert}>Adicionar</Button>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    form: {
        gap: 12,
        marginTop: 40,
        marginBottom: 40,
    },
});
