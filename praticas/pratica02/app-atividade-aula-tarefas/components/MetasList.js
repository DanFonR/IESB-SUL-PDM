import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function MetasList(props) {
    return (
        <ScrollView>
            {props.array.map((meta) => (
                <View key={meta.id} style={styles.item}>
                    <Pressable
                        android_ripple={{color: 'yellow'}}
                        onPress={() => props.onDeleteItem(meta.id)}
                    >
                        <Text style={{padding: 10}}>{meta.texto}</Text>
                    </Pressable>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    item: {
        margin: 8,
        borderRadius: 5,
        backgroundColor: 'lightblue'
    }
});
