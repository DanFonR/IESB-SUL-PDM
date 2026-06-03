import {
    Alert, Modal, ScrollView, StyleSheet,
    Text, TouchableOpacity, View,
    KeyboardAvoidingView,
} from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { MoneyContext } from "../contexts/GlobalState";
import DescriptionInput from "./DescriptionInput";
import CurrencyInput from "./CurrencyInput";
import DatePicker from "./DatePicker";
import CategoryPicker from "./CategoryPicker";
import Button from "./Button";
import colors from "../constants/colors";

function parseCurrency(text) {
    const value = text.replace(/\D/g, "");
    return (parseFloat(value) || 0.0) / 100;
}

/**
 * @param {{ visible: boolean, transaction: object|null, onClose: () => void }} props
 */
export default function EditTransactionModal({ visible, transaction, onClose }) {
    const { categories, updateTransaction } = useContext(MoneyContext);
    const valueInputRef = useRef();

    const [form, setForm] = useState({
        description: "",
        value: 0,
        date: new Date(),
        categoryId: "",
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!transaction) return;

        setForm({
            description: transaction.description ?? "",
            value: Number(transaction.value) ?? 0,
            date: new Date(transaction.date),
            categoryId: transaction.categoryId ?? transaction.category?.id ?? "",
        });
    }, [transaction]);

    const handleSave = async () => {
        if (!form.description.trim()) {
            Alert.alert("Informe a descrição");
            return;
        }
        if (!form.value || form.value <= 0) {
            Alert.alert("Informe um valor maior que zero");
            return;
        }
        if (!form.categoryId) {
            Alert.alert("Selecione uma categoria");
            return;
        }

        setSubmitting(true);

        try {
            await updateTransaction(transaction.id, {
                description: form.description.trim(),
                value: form.value,
                date: form.date,
                categoryId: form.categoryId,
            });
            Alert.alert("Transação atualizada!");
            onClose();
        }
        catch (err) {
            Alert.alert("Erro ao salvar", err.message ?? "Tente novamente.");
        }
        finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView behavior="padding" style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Editar transação</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={12}>
                            <Text style={styles.closeX}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
                        <View style={styles.form}>
                            <DescriptionInput
                                value={form.description}
                                onChange={(text) => setForm({ ...form, description: text })}
                                valueInputRef={valueInputRef}
                            />
                            <CurrencyInput
                                value={form.value}
                                onChange={(text) => setForm({ ...form, value: parseCurrency(text) })}
                                valueInputRef={valueInputRef}
                            />
                            <DatePicker
                                value={form.date}
                                onChange={(date) => setForm({ ...form, date })}
                            />
                            <CategoryPicker
                                value={form.categoryId}
                                onChange={(id) => setForm({ ...form, categoryId: id })}
                                categories={categories}
                            />
                        </View>

                        <Button onPress={handleSave}>
                            {submitting ? "Salvando..." : "Salvar alterações"}
                        </Button>

                        <View style={{ height: 24 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "90%",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.primaryText,
    },
    closeX: {
        fontSize: 18,
        color: colors.secondaryText,
        padding: 4,
    },
    body: {
        paddingHorizontal: 20,
    },
    form: {
        gap: 12,
        marginTop: 16,
        marginBottom: 20,
    },
});
