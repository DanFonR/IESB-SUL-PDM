import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyles from "../styles/globalStyles";
import CategoryItem from "./CategoryItem";

export default function TransactionItem({ item, onLongPress }) {
    const {category, date, description, value } = item;

    const valueStyle = (category?.isIncome)?
                        globalStyles.positiveText : globalStyles.negativeText;
    const currencyStyle = {style: "currency", currency: "BRL"};
    const currencyValue = Number(value).toLocaleString("pt-BR", currencyStyle);

    return (
        <TouchableOpacity onLongPress={onLongPress} activeOpacity={0.7}>
            <View style={styles.itemContainer}>
                <CategoryItem category={category} />
                <View style={styles.textContainer}>
                    <Text style={globalStyles.secondaryText}>
                        {new Date(date).toLocaleDateString("pt-BR")}
                    </Text>
                    <View style={styles.bottomLineContainer}>
                        <Text style={globalStyles.primaryText}>{description}</Text>
                        <Text style={valueStyle}>
                            {currencyValue}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={globalStyles.line} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 4,
    },
    textContainer: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        marginLeft: 12,
        paddingVertical: 8,
    },
    bottomLineContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
