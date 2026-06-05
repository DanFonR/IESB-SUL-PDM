import {
    ActivityIndicator, Alert, Keyboard,
    KeyboardAvoidingView, ScrollView, StyleSheet,
    Text, TouchableWithoutFeedback, View
} from "react-native";
import Button from "../../components/Button";
import globalStyles from "../../styles/globalStyles";
import { useContext, useMemo, useRef, useState } from "react";
import DescriptionInput from "../../components/DescriptionInput";
import CurrencyInput from "../../components/CurrencyInput";
import DatePicker from "../../components/DatePicker";
import CategoryPicker from "../../components/CategoryPicker";
import { MoneyContext } from "../../contexts/GlobalState";
import colors from "../../constants/colors";

/**
 * @description Converte BRL em `number`
 * @param {string} text O valor em texto
 * @returns {number} Um valor que pode ser usado em cálculos
 */
function parseCurrency(text) {
    const value = text.replace(/\D/g, "");

    return (parseFloat(value) || 0.0) / 100;
}

function _defaultCategoryId(categories) {
    if (categories.length === 0) return "";

    const income = categories.find((c) => c.isIncome);

    return (income)? income.id : categories[0].id;
}

/**
 * @description Cria um formulário em branco
 * @param {{description: string, value: number, date: Date, categoryId: string}} categoryIdFunc 
 * @returns {{description: string, value: number, date: Date, categoryId: string}} Um formulário em branco
 */
function _buildInitialForm(categoryIdFunc) {
    return {
        description: "",
        value: 0.0,
        date: new Date(),
        categoryId: categoryIdFunc,
    };
}

/**
 * @description Aba de registro de transações.
 * Registra descrição, valor, data e categoria da transação
 */
export default function AddTransactions() {
    const { categories, loading, addTransaction } = useContext(MoneyContext);
    const valueInputRef = useRef();

    const defaultCategoryId = useMemo(() => _defaultCategoryId(categories), [categories]);
    const buildInitialForm = () => _buildInitialForm(defaultCategoryId);

    const [form, setForm] = useState(buildInitialForm);
    const [submitting, setSubmitting] = useState(false);

    if (!form.categoryId && defaultCategoryId)
        setForm((prev) => ({ ...prev, categoryId: defaultCategoryId }));

    const handleAdd = async () => {
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
            await addTransaction({
                description: form.description.trim(),
                value: form.value,
                date: form.date,
                categoryId: form.categoryId
            });
            setForm(buildInitialForm());
            Alert.alert("Transação adicionada com sucesso");
        }
        catch (err) {
            Alert.alert("Erro ao salvar", err.message ?? "Tente novamente");
        }
        finally {
            setSubmitting(false);
        }
    }

    if (loading)
        return (
            <View style={[globalStyles.screenContainer, styles.center]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={globalStyles.secondaryText}>Carregando categorias...</Text>
            </View>
        );

    if (categories.length === 0)
        return (
            <View style={[globalStyles.screenContainer, styles.center]}>
                <Text style={globalStyles.primaryText}>
                    Nenhuma categoria cadastrada.
                </Text>
                <Text style={globalStyles.secondaryText}>
                    Vá até a aba &quot;Categorias&quot; para criar a primeira.
                </Text>
            </View>
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
                            value={form.categoryId}
                            onChange={(itemValue) => setForm({ ...form, categoryId: itemValue })}
                            categories={categories}
                        />
                    </View>
                    <Button onPress={handleAdd}>{(submitting)? "Salvando..." : "Adicionar"}</Button>
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
    center: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 24,
    },
});
