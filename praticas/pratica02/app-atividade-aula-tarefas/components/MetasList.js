import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

export default function MetasList(props) {
    return (
        <ScrollView>
            {props.array.map((meta) => (
                <View key={meta.id} style={styles.item}>
                    <Pressable
                        android_ripple={{color: 'yellow'}}
                        onPress={() => props.onDeleteItem(meta.id)}
                        key={meta.id}
                    >
                        <Text style={{padding: 8}}>{meta.texto}</Text>
                    </Pressable>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    item: {
        margin: 8,
        backgroundColor: 'lightblue',
    }
});
