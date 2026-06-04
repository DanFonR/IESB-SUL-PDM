import {
    ActivityIndicator, Alert, FlatList,
    RefreshControl, StyleSheet, Text,
    TouchableOpacity, View
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import TransactionItem from "../../components/TransactionItem";
import globalStyles from "../../styles/globalStyles";
import colors from "../../constants/colors";
import MonthYearPicker from "../../components/MonthYearPicker";
import EditTransactionModal from "../../components/EditTransactionModal";

/**
 * @description Cria menu para tratar toque longo em itens de transação
 * @param {Object} item Uma transação
 * @param {(Object?) => void} onEdit O que fazer ao editar o item
 * @param {(Object?) => void} onDelete O que fazer ao deletar um item
 */
function longPressMenu(item, onEdit, onDelete) {
    const cancelButton = { text: "Cancelar", style: "cancel" };
    const confirmButton = { text: "Excluir", style: "destructive", onPress: () => onDelete(item) };
    const editButton = { text: "Editar", onPress: () => onEdit(item) };

    Alert.alert(
        item.description,
        `Valor: ${Number(item.value).toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}`,
        [editButton, cancelButton, confirmButton], { cancelable: true }
    );
}

export default function Transactions() {
    const {
        transactions, loading, error,
        refresh, removeTransaction, filtroMes,
        filtroAno, changeFilter, user
    } = useContext(MoneyContext);
    const [editingItem, setEditingItem] = useState(null);

    const handleDelete = (item) => {
        const cancelButton = { text: "Cancelar", style: "cancel" };
        const deleteButton = {
            text: "Excluir", style: "destructive",
            onPress: async () => {
                try {
                    await removeTransaction(item.id);
                }
                catch (err) {
                    Alert.alert("Erro ao excluir", err.message ?? "Tente novamente");
                }
            }
        };

        Alert.alert(
            "Excluir transação",
            `Deseja excluir "${item.description}"?`,
            [cancelButton, deleteButton], { cancelable: true }
        );
    };
    const handleLongPress = (item) => longPressMenu(item, setEditingItem, handleDelete);

    // Mensagem de boas vindas inicial
    useEffect(() => {
        const name = (user)? user.name.split(" ")[0] : "Usuário";

        if (!error)
            Alert.alert(`Olá, ${name}`, "Seja bem-vindo(a)");
    }, [error, user]);

    if (loading && transactions.length === 0)
        return (
            <View style={[globalStyles.screenContainer, styles.center]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={globalStyles.secondaryText}>Carregando transações...</Text>
            </View>
        );

    if (error)
        return (
            <View style={[globalStyles.screenContainer, styles.center]}>
                <Text style={globalStyles.primaryText}>
                    Não foi possível carregar.
                </Text>
                <Text style={globalStyles.secondaryText}>{error}</Text>
                <TouchableOpacity onPress={refresh} style={styles.retry}>
                    <Text style={styles.retryText}>Tentar novamente</Text>
                </TouchableOpacity>
            </View>
        );

    return (
        <View style={globalStyles.screenContainer}>
            <MonthYearPicker month={filtroMes} year={filtroAno} onChange={changeFilter} />
            <FlatList
                data={transactions}
                renderItem={({ item }) => (
                    <TransactionItem
                        item={item}
                        onLongPress={() => handleLongPress(item)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={globalStyles.secondaryText}>
                        Ainda não há itens!
                    </Text>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={() => refresh(filtroMes, filtroAno)}
                    />
                }
                contentContainerStyle={styles.listContent}
                keyExtractor={(item) => String(item.id)}
            />

            <EditTransactionModal
                visible={Boolean(editingItem)}
                transaction={editingItem}
                onClose={() => setEditingItem(null)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        gap: 12,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 24,
    },
    retry: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.primary,
        borderRadius: 8,
    },
    retryText: {
        color: colors.primaryContrast,
        fontWeight: "600",
    },
    welcomeBanner: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    welcomeText: {
        fontSize: 15,
        color: colors.primaryText,
    },
});
