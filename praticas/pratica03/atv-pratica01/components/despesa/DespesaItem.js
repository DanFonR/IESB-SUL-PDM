import { View, Text, Pressable, StyleSheet } from 'react-native';

/** @param {Date} data */
function getDataFormatada(data) {
    return data.toLocaleDateString('pt-BR');
}

export default function DespesaItem({item}) {
    return (
        <Pressable>
            <View style={styles.itemContainer}>
                <View style={styles.itemText}>
                    <Text>{getDataFormatada(item.data)}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{item.descricao}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>R$ {item.valor}</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        padding: 5,
        margin: 5,
        backgroundColor: 'lightgray',
        flexDirection: 'row',
    },
    itemText: {
        flex: 1,
        padding: 2,
        margin: 2,
        alignContent: 'left',
    },
});
