import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";

/**
 * @param { Object } props
 * @param { Date } props.value
 * @param { (Object) => void } props.onChange
*/
export default function DatePicker({ value, onChange }) {
    const [showPicker, setShowPicker] = useState(false);
    const datePickerDisplayType = (Platform.OS === "ios")? "inline" : "default";

    const handleDateChange = (_, selectDate) => {
        setShowPicker(false)

        if (selectDate) onChange(selectDate)
    }

    return (
        <View>
            <Text style={globalStyles.inputLabel}>Data</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
                <TextInput
                    value={value.toLocaleDateString("pt-BR")}
                    onChangeText={onChange}
                    style={globalStyles.input}
                    editable={false}
                />
            </TouchableOpacity>

            {showPicker && (
                <RNDateTimePicker
                    mode="date"
                    display={datePickerDisplayType}
                    value={value}
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
}
