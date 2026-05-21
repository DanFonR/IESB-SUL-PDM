import {
    Alert, Button, Platform,
    ScrollView, StyleSheet, Text,
    TextInput,TouchableOpacity,View,
} from "react-native";
// components/Button.jsx?
import globalStyles from "../../styles/globalStyles";
import { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import categories from "../../constants/categories";
import colors from "../../constants/colors";

function parseCurrency(text) {
    const value = text.replace("/\D/g", "");

    return (parseFloat(value) || 0.0) / 100;
}

export default function AddTransactions() {
    const initialForm = {
        description: '',
        value: 0.0,
        date: new Date(),
        category: 'Renda',
    };
    const [form, setForm] = useState(initialForm);
    const [showPicker, setShowPicker] = useState(false);
    const datePickerDisplayType = (Platform.OS === "ios")? "inline" : "default";

    const transactionAlert = () => Alert.alert(
        `${form.description} | ${form.value} | ${form.date} | ${form.category}`,
    );
    const handleDateChange = (_, selectDate) => {
        setShowPicker(false);

        if (selectDate) setForm({...form, date: selectDate});
    }

    return (
        <View style={globalStyles.screenContainer}>
            <ScrollView style={globalStyles.content}>
                <View style={styles.form}> {/* cada view interna um input */}
                    <View>
                        <Text style={globalStyles.inputLabel}>Descrição</Text>
                        <TextInput
                            value={form.description}
                            onChangeText={(text) => setForm({...form, description: text})}
                            style={globalStyles.input}
                        />
                    </View>
                    <View>
                        <Text style={globalStyles.inputLabel}>Valor</Text>
                        <TextInput
                            value={form.value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}
                            onChangeText={(text) => setForm({...form, value: parseCurrency(text)})}
                            style={globalStyles.input}
                            keyboardType='numeric'
                        />
                    </View>
                    <View>
                        <Text style={globalStyles.inputLabel}>Data</Text>
                        <TouchableOpacity>
                            <TextInput
                                value={form.date.toLocaleDateString("pt-BR")}
                                onChangeText={(text) => setForm({...form, date: text})}
                                style={globalStyles.input}
                                editable={false}
                            />
                        </TouchableOpacity>
                        {showPicker && (
                            <RNDateTimePicker
                                mode="date"
                                display={datePickerDisplayType}
                                value={form.date}
                                onChange={handleDateChange}
                            />
                        )}
                    </View>
                    <View>
                        <Text style={globalStyles.inputLabel}>Categoria</Text>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={form.category}
                                onValueChange={(itemValue) => setForm({ ...form, category: itemValue })}
                            >
                                {Object.values(categories).map(
                                    ({displayName, name}, index) => (
                                        <Picker.Item key={index} label={displayName} value={name} />
                                    )
                                )}
                            </Picker>
                        </View>
                    </View>
                </View>
                <Button title='Adicionar' onPress={transactionAlert} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        gap: 12,
        marginTop: 40,
        marginBottom: 40,
    },
    picker: {
        display: "flex",
        justifyContent: "center",
        height: 44,
        borderColor: colors.secondaryText,
        borderWidth: 1,
        borderRadius: 8,
        flexGrow: 1,
    }
});
