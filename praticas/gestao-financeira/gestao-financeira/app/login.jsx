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

function validateEntries(email, password) {
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

    return true;
}

export default function LoginScreen() {
    const { login } = useContext(MoneyContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!validateEntries(email, password)) return;

        setLoading(true);

        try {
            await login(email.trim(), password);
        }
        catch (err) {
            let msg = err.message ?? "Verifique suas credenciais.";

            if (msg.includes("inválidas"))
                msg = "E-mail ou senha errados.\nTente novamente";

            Alert.alert("Erro ao entrar", msg);
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
                    <Text style={styles.appName}>Money</Text>
                </View>

                <View style={styles.form}>
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
                                placeholder="********"
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

                    <Button
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {(loading)? (<ActivityIndicator color="#FFF" />)
                        : (<Text style={styles.loginButtonText}>Entrar</Text>)}
                    </Button>
                </View>

                <Link style={styles.footer} href="./register">
                    Não tem conta? Crie uma agora
                </Link>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    appName: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.primaryText,
        marginBottom: 6,
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
        width: 48,
        borderWidth: 1,
        borderColor: colors.secondaryText,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF",
    },
    eyeText: {
        fontSize: 18,
    },
    loginButtonText: {
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
