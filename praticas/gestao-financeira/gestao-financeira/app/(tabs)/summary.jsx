import { useContext, useMemo } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import categories from "../../constants/categories";
import globalStyles from "../../styles/globalStyles";
import SummaryItem from "../../components/SummaryItem";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../constants/colors";

const SUMMARY_CATEGORY_KEYS = [
  categories.income.name,
  categories.food.name,
  categories.house.name,
  categories.education.name,
  categories.travel.name,
];

function getTotals(transactions) {
    const totals = Object.fromEntries(
        ["sum", "income", "food", "education", "house", "travel"]
        .map((key) => [key, 0])
    );

    for (const item of transactions) {
        if (!SUMMARY_CATEGORY_KEYS.includes(item.category)) continue;

        totals[item.category] += item.value;

        if (item.category === categories.income.name)
            totals.sum += item.value;
        else
            totals.sum -= item.value;
    }

    return totals;
}

export default function Summary() {
    const [transactions] = useContext(MoneyContext);
    const totals = useMemo(getTotals, [transactions]);
    const valueStyle = (totals.sum > 0)? globalStyles.positiveText : globalStyles.negativeText;
    const currencyStyle = {style: "currency", currency: "BRL"};
    const summaryItems = Object.values(categories).map(
        (category, index) => (
            <SummaryItem
                key={index}
                category={category.name}
                value={totals[category.name]}
            />
        )
    );

    return (
        <View style={globalStyles.screenContainer}>
            <View style={globalStyles.content}>
                {summaryItems}
                <View style={globalStyles.line} />
                <View style={styles.balance}>
                    <Text style={styles.balanceText}>Saldo</Text>
                    <Text style={valueStyle}>
                        {totals.sum.toLocaleString("pt-BR", currencyStyle)}
                    </Text>
                </View>
            </View>
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
        fontWeight: 800,
    },
});
