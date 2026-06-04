import { useContext, useMemo } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import globalStyles from "../../styles/globalStyles";
import SummaryItem from "../../components/SummaryItem";
import MonthYearPicker from "../../components/MonthYearPicker";
import {
    ActivityIndicator, Dimensions, ScrollView,
    StyleSheet, Text, View
} from "react-native";
import colors from "../../constants/colors";
import SVG, { Path as SVGPath } from "react-native-svg";

const currencyStyle = {style: "currency", currency: "BRL"};
const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_SIZE = Math.min(SCREEN_WIDTH - 40, 280);

function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;

    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
}

function pieSlicePath(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const arc = Number(endAngle - startAngle > 180);

    return (
        `M ${cx} ${cy} `
        + `L ${start.x} ${start.y} `
        + `A ${r} ${r} ${0} ${arc} 0 ${end.x} ${end.y} `
        + "Z"
    );
}

function PieChart({ slices }) {
    const cx = CHART_SIZE / 2;
    const cy = cx;
    const r = cx - 10;

    let currentAngle = 0;
    const total = slices.reduce((acc, next) => acc + next.value, 0);

    if (total === 0) return null;

    const paths = slices.map((slice) => {
        const sweep = (slice.value / total) * 360;
        const path = pieSlicePath(cx, cy, r, currentAngle, currentAngle + sweep);
        currentAngle += sweep;

        return { ...slice, path };
    });

    return (
        <SVG width={CHART_SIZE} height={CHART_SIZE}>
            {paths.map((slice, index) => (
                <SVGPath
                    key={index} d={slice.path}
                    fill={slice.color} stroke="#FFF"
                    strokeWidth={2}
                />
            ))}
        </SVG>
    );
}

function Chart({ slices, total, title }) {
    if (slices.length === 0) return null;

    const legend = slices.map((slice, index) => (
        <View key={index} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: slice.color }]} />
            <Text style={styles.legendLabel}>{slice.label}</Text>
            <Text style={styles.legendValue}>
                {slice.value.toLocaleString("pt-BR", currencyStyle)}
            </Text>
            <Text style={styles.legendPercent}>
                ({(total > 0)? (slice.value / total * 100).toFixed(1) : 0}%)
            </Text>
        </View>
    ));

    return (
        <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.pieWrapper}>
                <PieChart slices={slices} />
            </View>
            {legend}
            <View style={globalStyles.line}/>
        </View>
    );
}

function getTotals(transactions, categories) {
    const totals = {};
    let saldo = 0;

    for (const category of categories) totals[category.id] = 0;

    for (const item of transactions) {
        const value = Number(item.value);
        const cat = item.category ?? categories.find((c) => c.id === item.categoryId);

        if (cat?.isIncome) {
            saldo += value;
            if (totals[cat.id] !== undefined) totals[cat.id] += value;
        }
        else {
            saldo -= value;
            if (cat && totals[cat.id] !== undefined) totals[cat.id] += value;
        }
    }

    return { totalsById: totals, balance: saldo };
}

export default function Summary() {
    const {
        transactions, categories, loading,
        filtroMes, filtroAno, changeFilter,
    } = useContext(MoneyContext);
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
                category={category}
                value={totalsById[category.id] ?? 0}
            />
    ));

    const slices = categories
                    .filter((cat) => !cat.isIncome && totalsById[cat.id] > 0)
                    .map((cat) => ({
                        label: cat.displayName,
                        value: totalsById[cat.id] ?? 0,
                        color: cat.background,
                    }));
    const total = slices.reduce((acc, slice) => acc + slice.value, 0);

    return (
        <View style={globalStyles.screenContainer}>
            <MonthYearPicker month={filtroMes} year={filtroAno} onChange={changeFilter} />
            <ScrollView style={globalStyles.content}>
                <Chart slices={slices} total={total} title="Despesas por Categoria" />
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
        marginTop: 8,
        marginBottom: 4,
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
    chartSection: {
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.primaryText,
        alignSelf: "flex-start",
        marginBottom: 12,
    },
    pieWrapper: {
        alignItems: "center",
        marginBottom: 16,
    },
    legendRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendLabel: {
        flex: 1,
        fontSize: 13,
        color: colors.primaryText,
    },
    legendValue: {
        fontSize: 13,
        color: colors.primaryText,
        fontWeight: "600",
    },
    legendPercent: {
        fontSize: 12,
        color: colors.secondaryText,
        minWidth: 48,
        textAlign: "right",
    },
});
