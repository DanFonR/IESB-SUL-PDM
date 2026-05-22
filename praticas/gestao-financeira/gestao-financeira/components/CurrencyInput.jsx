import { Text, TextInput, View } from "react-native"
import globalStyles from "../styles/globalStyles"

/** 
 * @param { Object } props
 * @param { number } props.value
 * @param { (Object) => void } props.onChange
 * @param { React.RefObject } props.valueInputRef
*/
export default function CurrencyInput({ value, onChange, valueInputRef }) {
    return (
        <View>
            <Text style={globalStyles.inputLabel}>Valor</Text>
            <TextInput
                ref={valueInputRef}
                value={value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}
                onChangeText={onChange}
                keyboardType="numeric"
                style={globalStyles.input}
            />
        </View>
    );
}
