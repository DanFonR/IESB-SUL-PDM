import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../constants/colors";

const MONTH_NAMES = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

/**
 * @param {{ month: number, year: number, onChange: (month: number, year: number) => void }} props
 */
export default function MonthYearPicker({ month, year, onChange }) {
    const prev = () => {
        if (month === 1) onChange(12, year - 1);
        else onChange(month - 1, year);
    };

    const next = () => {
        if (month === 12) onChange(1, year + 1);
        else onChange(month + 1, year);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={prev} hitSlop={12} style={styles.arrow}>
                <MaterialIcons name="chevron-left" size={26} color={colors.primaryContrast} />
            </TouchableOpacity>

            <Text style={styles.label}>{MONTH_NAMES[month - 1]} {year}</Text>

            <TouchableOpacity onPress={next} hitSlop={12} style={styles.arrow}>
                <MaterialIcons name="chevron-right" size={26} color={colors.primaryContrast} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        gap: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.primaryContrast,
        minWidth: 100,
        textAlign: "center",
    },
    arrow: {
        padding: 4,
    },
});
