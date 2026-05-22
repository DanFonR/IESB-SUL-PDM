import { Text, TextInput, View } from "react-native";
import globalStyles from "../styles/globalStyles";

/**
 * @param { Object } props
 * @param { string } props.value
 * @param { (Object) => void } props.onChange
 * @param { React.RefObject } props.valueInputRef
 */
export default function DescriptionInput({ value, onChange, valueInputRef }) {
    return (
        <View>
            <Text style={globalStyles.inputLabel}>Descrição</Text>
            <TextInput
                value={value}
                returnKeyType="next"
                onChangeText={onChange}
                onSubmitEditing={() => valueInputRef.current.focus()}
                style={globalStyles.input}
            />
        </View>
    );
}
