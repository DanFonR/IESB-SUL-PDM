import { StyleSheet, TextInput, Button, View } from 'react-native';
import React, { useState } from 'react';
import { rotulo_input_meta, rotulo_btn_cadastro_meta } from '../mensagens';

export default function MetaInput(props) {
    const [inputMetaText, setinputMetaText] = useState('');

    function metaInputHandler(inputText) {
        setinputMetaText(inputText);
    }

    function addMetaHandler() {
        props.onAddMeta(inputMetaText);
        setinputMetaText('');
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
            <View style={{width: '65%'}}>
                <TextInput
                    placeholder={rotulo_input_meta}
                    style={styles.inputText}
                    onChangeText={metaInputHandler}
                    value={inputMetaText}
                />
            </View>
            <View style={{width: '30%'}}>
                <Button
                    title={rotulo_btn_cadastro_meta}
                    onPress={addMetaHandler}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputText: {
        borderColor: '#ccc',
        borderWidth: 1,
    },
});
