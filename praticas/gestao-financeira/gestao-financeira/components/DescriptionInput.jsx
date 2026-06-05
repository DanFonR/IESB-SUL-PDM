import { Text, TextInput, View } from "react-native";
import globalStyles from "../styles/globalStyles";

/**
 * @description Entrada para descrição de transação
 * @param {Object} props
 * @param {string} props.value O texto exibido
 * @param {(string) => void | Promise<void>} props.onChange O que fazer ao editar o texto
 * @param {React.RefObject} props.valueInputRef Referência
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
