import { FlatList, Text, View } from "react-native";
import { useContext } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import TransactionItem from "../../components/TransactionItem";
import globalStyles from "../../styles/globalStyles";

// filtro data
// onlongpress = modal (transactionitem = touchableopacity>...)

export default function Transactions() {
    const [transactions] = useContext(MoneyContext);

    return (
        <View style={globalStyles.screenContainer}>
            <FlatList
                data={transactions}
                renderItem={({ item }) => <TransactionItem {...item} />}
                ListEmptyComponent={
                    <Text style={globalStyles.secondaryText}>
                        Ainda não há itens!
                    </Text>
                }
                style={globalStyles.content}
                keyExtractor={(item) => String(item.id)}
            />
        </View>
    );
}
