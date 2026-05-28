import { useContext, useMemo } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import globalStyles from "../../styles/globalStyles";
import SummaryItem from "../../components/SummaryItem";
import {
    ActivityIndicator, ScrollView, StyleSheet,
    Text, View
} from "react-native";
import colors from "../../constants/colors";

const currencyStyle = {style: "currency", currency: "BRL"};

function getTotals(transactions, categories) {
    const totals = {};
    let saldo = 0;

    for (const category of categories) totals[category.id] = 0;

    for (const item of transactions) {
        const value = Number(item.value);
        const cat = item.category ?? categories.find((c) => c.id === item.categoryId);

        if (cat?.isIncome)
            saldo += value;
        else
            saldo -= value;
    }

    return { totalsById: totals, balance: saldo };
}

export default function Summary() {
    const { transactions, categories, loading } = useContext(MoneyContext);
    const { totalsById, balance } = useMemo(
        () => getTotals(transactions, categories),
        [transactions, categories]
    );

    if (loading && categories.length === 0)
        return (
            <View style={[globalStyles.screenContainer, styles.center]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );

    const balanceStyle = (balance >= 0)? globalStyles.positiveText : globalStyles.negativeText;
    const summaryItems = categories.map(
        (category) => (
            <SummaryItem
                key={category.id}
                category={category.name}
                value={totalsById[category.id] ?? 0}
            />
    ));

    return (
        <View style={globalStyles.screenContainer}>
            <ScrollView style={globalStyles.content}>
                {summaryItems}
                <View style={globalStyles.line} />
                <View style={styles.balance}>
                    <Text style={styles.balanceText}>Saldo</Text>
                    <Text style={balanceStyle}>
                        {balance.toLocaleString("pt-BR", currencyStyle)}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    balance: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    balanceText: {
        fontSize: 18,
        color: colors.primaryText,
        fontWeight: "800",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
