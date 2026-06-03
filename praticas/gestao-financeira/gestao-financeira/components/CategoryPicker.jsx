import { Picker } from "@react-native-picker/picker"
import { StyleSheet, Text, View } from "react-native"
import globalStyles from "../styles/globalStyles"
import colors from "../constants/colors"

/**
 * @param { Object } props
 * @param { Object } props.value
 * @param { (Object) => void } props.onChange
*/
export default function CategoryPicker({ value, onChange, categories }) {
    const pickerItems = categories?.map(
        ({ id, displayName }) => (
            <Picker.Item key={id} label={displayName} value={id} />
        )
    );

    return (
        <View>
            <Text style={globalStyles.inputLabel}>Categoria</Text>
            <View style={styles.picker}>
                <Picker selectedValue={value} onValueChange={onChange} >
                    {pickerItems}
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    picker: {
        display: "flex",
        justifyContent: "center",
        height: 44,
        borderColor: colors.secondaryText,
        borderWidth: 1,
        borderRadius: 8,
        flexGrow: 1
    },
});
