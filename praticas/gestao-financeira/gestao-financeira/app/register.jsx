import {
    ActivityIndicator, Alert, KeyboardAvoidingView,
    ScrollView, StyleSheet, Text,
    TextInput, TouchableOpacity, View,
} from "react-native";
import { useContext, useState } from "react";
import { MoneyContext } from "../contexts/GlobalState";
import colors from "../constants/colors";
import globalStyles from "../styles/globalStyles";
import { Link } from "expo-router";
import Button from "../components/Button";

function validateEntries(name, email, password, confirmPassword) {
    if (!name.trim() || name.trim().length < 2) {
        Alert.alert("Campo obrigatório", "Informe seu nome (mín. 2 caracteres).");
        return false;
    }

    if (!email.trim()) {
        Alert.alert("Campo obrigatório", "Informe o e-mail.");
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        Alert.alert("E-mail inválido", "Informe um endereço de e-mail válido.");
        return false;
    }

    if (!password) {
        Alert.alert("Campo obrigatório", "Informe a senha.");
        return false;
    }

    if (password.length < 6) {
        Alert.alert("Senha muito curta", "A senha deve ter no mínimo 6 caracteres.");
        return false;
    }

    if (password !== confirmPassword) {
        Alert.alert("Senhas diferentes", "A confirmação não coincide com a senha.");
        return false;
    }

    return true;
}

export default function RegisterScreen() {
    const { register } = useContext(MoneyContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleRegister = async () => {
        if (!validateEntries(name, email, password, confirmPassword)) return;

        setLoading(true);

        try {
            await register(name.trim(), email.trim(), password);
        }
        catch (err) {
            Alert.alert("Erro ao criar conta", err.message ?? "Tente novamente.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={globalStyles.screenContainer} behavior="padding">
            <ScrollView
                contentContainerStyle={globalStyles.content}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.appName}>Criar conta</Text>
                    <Text style={styles.subtitle}>Preencha os dados abaixo para começar</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={globalStyles.inputLabel}>Nome</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="José dos Santos Silva"
                            autoCapitalize="words"
                            autoCorrect={false}
                            placeholderTextColor={colors.secondaryText}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={globalStyles.inputLabel}>E-mail</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="seu@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor={colors.secondaryText}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={globalStyles.inputLabel}>Senha</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                style={[globalStyles.input, styles.passwordInput]}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Mínimo 6 caracteres"
                                secureTextEntry={!showPassword}
                                placeholderTextColor={colors.secondaryText}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword((v) => !v)}
                            >
                                <Text style={styles.eyeText}>{showPassword ? "⌣" : "👁"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={globalStyles.inputLabel}>Confirmar senha</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                style={[globalStyles.input, styles.passwordInput]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Repita a senha"
                                secureTextEntry={!showConfirm}
                                placeholderTextColor={colors.secondaryText}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowConfirm((v) => !v)}
                            >
                                <Text style={styles.eyeText}>{showConfirm ? "⌣" : "👁"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Button onPress={handleRegister} disabled={loading}>
                        {loading
                            ? <ActivityIndicator color="#FFF" />
                            : <Text style={styles.buttonText}>Criar conta</Text>
                        }
                    </Button>
                </View>

                <Link style={styles.footer} href="./login">
                    Já tem conta? Faça login
                </Link>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        marginBottom: 32,
        marginTop: 16,
    },
    appName: {
        fontSize: 26,
        fontWeight: "800",
        color: colors.primaryText,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: colors.secondaryText,
        textAlign: "center",
    },
    form: {
        gap: 16,
        marginBottom: 24,
    },
    inputGroup: {
        gap: 4,
    },
    passwordRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    passwordInput: {
        flex: 1,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRightWidth: 0,
    },
    eyeButton: {
        height: 40,
        width: 44,
        borderWidth: 1,
        borderColor: colors.secondaryText,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF",
    },
    eyeText: {
        fontSize: 18,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "700",
    },
    footer: {
        textAlign: "center",
        fontSize: 13,
        color: colors.secondaryText,
    },
});
