import {
    ActivityIndicator, Alert, FlatList,
    RefreshControl, StyleSheet, Text,
    TouchableOpacity, View
} from "react-native";
import { useContext } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import TransactionItem from "../../components/TransactionItem";
import globalStyles from "../../styles/globalStyles";
import colors from "../../constants/colors";

function longPressAlert(item, onPress) {
    const cancelButton = { text: "Cancelar", style: "cancel" };
    const confirmButton = { text: "Excluir", style: "destructive", onPress: onPress };

    Alert.alert(
        "Excluir transação", `Deseja excluir ${item.id}?`,
        [cancelButton, confirmButton], { cancelable: true }
    );
}

export default function Transactions() {
    const { transactions, loading, error, refresh, removeTransaction } = useContext(MoneyContext);
    const onPress = (item) => (async () => {
        try {
            await removeTransaction(item.id);
        }
        catch (err) {
            Alert.alert("Erro ao excluir", err.message ?? "Tente novamente");
        }
    });
    const handleLongPress = (item) => longPressAlert(item, onPress(item));

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
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                contentContainerStyle={styles.listContent}
                keyExtractor={(item) => String(item.id)}
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
});
