import { Text, View, ScrollView, TextInput, Alert, Button } from 'react-native';
// components/Button.jsx?
import globalStyles from '../../styles/globalStyles';
import { useState } from 'react';

export default function AddTransactions() {
    const initialForm = {
        description: '',
        value: 0,
        date: '',
        category: 'Renda',
    };
    const [form, setForm] = useState(initialForm);
    const transactionAlert = () => Alert.alert(
        `${form.description} | ${form.value} | ${form.date} | ${form.category}`,
    );

    return (
        <View style={globalStyles.screenContainer}>
            <ScrollView style={globalStyles.content}>
                <View>
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
                            value={form.value}
                            onChangeText={(text) => setForm({...form, value: text})}
                            style={globalStyles.input}
                            keyboardType='numeric'
                        />
                    </View>
                    <View>
                        <Text style={globalStyles.inputLabel}>Data</Text>
                        <TextInput
                            value={form.date}
                            onChangeText={(text) => setForm({...form, date: text})}
                            style={globalStyles.input}
                        />
                    </View>
                    <View>
                        <Text style={globalStyles.inputLabel}>Categoria</Text>
                        <TextInput
                            value={form.category}
                            onChangeText={(text) => setForm({...form, category: text})}
                            style={globalStyles.input}
                        />
                    </View>
                </View>
                <Button title='Adicionar' onPress={transactionAlert} />
            </ScrollView>
        </View>
    );
}
